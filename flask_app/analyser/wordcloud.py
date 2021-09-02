import pandas as pd
from collections import Counter
import numpy as np
from pandas import DataFrame
c = Counter()


class Wordcloud:
    def __init__(self, username, since, end) -> None:
        since_day = pd.to_datetime(since)
        end_day = pd.to_datetime(end)
        self.df = pd.read_excel("./Sentimental/%s-tweets-analysed.xlsx" % username, engine= 'openpyxl')
        self.df_filtered = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
        self.df_filtered_2020 = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
        self.username = username

    def get_wordcloud(self)-> dict:
        counts = pd.Series(np.concatenate([str(x).split() for x in self.df_filtered['no-stopword-text']])).value_counts()
        sliced = counts.iloc[:200]

        counts_2020 = pd.Series(np.concatenate([str(x).split() for x in self.df_filtered_2020['no-stopword-text']])).value_counts()
        sliced_2020 = counts_2020.iloc[:200]
        
        dict = {
            "2021": sliced.to_dict(),
            "2020": sliced_2020.to_dict()
        }
        return dict
       
