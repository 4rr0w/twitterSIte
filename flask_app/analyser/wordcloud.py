import pandas as pd

class Wordcloud:
    def __init__(self, username, since, end) -> None:
        since_day = pd.to_datetime(since)
        end_day = pd.to_datetime(end)
        self.df = pd.read_excel("./Sentimental/%s-tweets-analysed.xlsx" % username, engine= 'openpyxl')
        self.df_filtered = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
        self.username = username

    def get_wordcloud(self)-> dict:
        dict = {}
      
        # dict =  {
        #     "on": 2,
        #     "two": 3,
        # }

        # self.df_filtered["filtered-text"]
        return dict