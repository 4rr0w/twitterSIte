from analyser.tweets import Twitter
from analyser.serve import Serve
from analyser.wordcloud import Wordcloud

def api_admin(username: str, start_date):
    analyser = Twitter()
    analyser.main(username, start_date)

def api_client(username: str, start_date, end_date):
    server = Serve(username, start_date, end_date)
    return server.get_sentiments()

def api_wordcloud(username: str, start_date, end_date):
    count = Wordcloud(username, start_date, end_date)
    return count.get_wordcloud()




