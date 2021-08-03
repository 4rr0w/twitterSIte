import os
import tweepy
from huepy import *  # refer to this https://github.com/s0md3v/huepy
import re
import time
import pandas as pd
from pandas import DataFrame
from mtranslate import translate
from textblob import TextBlob


class Twitter:
    def __init__(self) -> None:
        self.df_extracted = DataFrame()
        self.df_translated = DataFrame()
        self.df_filtered = DataFrame()
        self.df_sentiments = DataFrame()
        self.df_partioned_sentiments = DataFrame()

    def extract_tweets(self, username, since):
        date_since = time.strptime(since, "%Y-%m-%d")
        # Function to read env file for api keys

        def get_api(path: str) -> dict:
            with open(path, 'r') as f:
                return dict(tuple(line.replace('\n', '').split('=')) for line in f.readlines() if not line.startswith('#'))

        # this variable stores dict for all the keys/data that should not be uploaded to github publicly.
        keys: dict = get_api("./.env")

        # set Oauth keys for tweepy
        auth = tweepy.OAuthHandler(keys['API_key'], keys['API_secret'])
        auth.set_access_token(keys['access_token'],
                              keys['access_token_secret'])
        api = tweepy.API(auth, wait_on_rate_limit=True,
                         wait_on_rate_limit_notify=True)

        # Get user's tweets object
        tweets = api.user_timeline(screen_name=username,
                                   # 200 is the maximum allowed count
                                   count=200,
                                   include_rts=False,
                                   # Necessary to keep full_text
                                   # otherwise only the first 140 words are extracted
                                   tweet_mode='extended'
                                   )

        all_tweets = []
        all_tweets.extend(tweets)
        oldest_id = tweets[-1].id
        try:
            while True:
                tweet_date = tweets[-1].created_at.strftime("%Y-%m-%d")
                oldest_tweet_date = time.strptime(tweet_date, "%Y-%m-%d")
                if(oldest_tweet_date < date_since):
                    break

                tweets = api.user_timeline(screen_name=username,
                                           # 200 is the maximum allowed count
                                           count=200,
                                           include_rts=False,
                                           max_id=oldest_id - 1,
                                           # Necessary to keep full_text
                                           # otherwise only the first 140 words are extracted
                                           tweet_mode='extended'
                                           )
                oldest_id = tweets[-1].id
                # if len(tweets) == 0:
                #     break
                all_tweets.extend(tweets)
        except:
            print(info("Tweet limit reached for user: %s" % username))

        # transform the tweepy tweets into a 2D array that will populate the csv
        outtweets = [[tweet.id_str,
                      tweet.created_at,
                      tweet.favorite_count,
                      tweet.retweet_count,
                      tweet.full_text.encode("utf-8").decode("utf-8")]
                     for idx, tweet in enumerate(all_tweets)]

        self.df_extracted = DataFrame(outtweets, columns=[
                                      "id", "created_at", "favorite_count", "retweet_count", "text"])
        print(good('Successfully extracted raw tweets for %s' % username))

    def translate_tweets(self, username):
        self.df_translated = self.df_extracted
        # concat multiple tweets for fast translations
        merged_tweets_df = pd.DataFrame(self.df_extracted.groupby(
            self.df_translated.index // 7)["text"].agg(" ENDOFTWEETS ".join))
        list = []
        for index, row in merged_tweets_df.iterrows():
            list.append(translate(row.text.encode(
                "utf-8").decode("utf-8"), "en"))

        final_translated_tweets = []
        for merged_tweets in list:
            for tweet in merged_tweets.split(" ENDOFTWEETS "):
                final_translated_tweets.append(tweet)

        self.df_translated["translated-text"] = pd.Series(
            final_translated_tweets)
        print(good('Successfully translated tweets for %s' % username))

    def filter_tweets(self, username):
        self.df_filtered = self.df_translated

        # concat multiple tweets for fast cleaning
        list = []
        for index, row in self.df_filtered.iterrows():
            # remove @usernames and special characters(*,!,.,?)
            clean_text = ' '.join(re.sub(
                "(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w +:\ / \ / \S +)", " ", str(row["translated-text"])).split())
            # remove urls and links
            clean_text = re.sub(
                'https?://[A-Za -z0-9./]+', '', str(clean_text))
            clean_text = clean_text.lower()
            # remove #xyz to xyz
            clean_text = re.sub("[^a-zA-Z]", " ", str(clean_text))
            list.append(clean_text)

        self.df_filtered["clean-text"] = pd.Series(list)
        print(good('Successfully filtered tweets for %s' % username))

    def analyse_sentiments(self, username):
        self.df_sentiments = self.df_filtered
        sentiments = DataFrame()
        sentiments[['polarity', 'subjectivity']] = self.df_filtered['clean-text'].apply(
            lambda Text: pd.Series(TextBlob(str(Text)).sentiment))
        self.df_sentiments[['polarity', 'subjectivity']] = sentiments

        if not os.path.exists("Sentimental"):
            os.makedirs("Sentimental")

        # output new excel file
        self.df_sentiments.to_excel(
            "./Sentimental/%s-tweets-analysed.xlsx" % username)
        print(good('Successfully written analysed tweets to: "./Sentimental/' +
              '%s-tweets-analysed.xlsx"' % username))

    def main(self, username: str, start_date):
        self.extract_tweets(username, start_date)
        self.translate_tweets(username)
        self.filter_tweets(username)
        self.analyse_sentiments(username)
