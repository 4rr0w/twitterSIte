import pandas as pd

class Serve:
    def __init__(self, username, since, end) -> None:
        since_day = pd.to_datetime(since)
        end_day = pd.to_datetime(end)
        self.df = pd.read_excel("./Sentimental/%s-tweets-analysed.xls" % username)
        self.df_filtered = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
        
        self.username = username
        
    def get_sentiments(self)-> dict:
        dict = {}
        dict["neutral"] = self.df_filtered[self.df_filtered["polarity"] == 0].shape[0]
        dict["weak_positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0) & (self.df_filtered["polarity"] <= 0.3)].shape[0]
        dict["positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0.3) & (self.df_filtered["polarity"] <= 0.6)].shape[0]
        dict["strong_positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0.6) & (self.df_filtered["polarity"] <= 1)].shape[0]
        dict["weak_negative"] = self.df_filtered[(self.df_filtered["polarity"] < 0) & (self.df_filtered["polarity"] >= -0.3)].shape[0]
        dict["negative"] = self.df_filtered[(self.df_filtered["polarity"] < -0.3) & (self.df_filtered["polarity"] >= -0.6)].shape[0]
        dict["strong_negative"] = self.df_filtered[(self.df_filtered["polarity"] < -0.6) & (self.df_filtered["polarity"] >= -1)].shape[0]

        return dict
        