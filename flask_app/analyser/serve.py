import pandas as pd

class Serve:
    def __init__(self, username, since, end) -> None:
        since_day = pd.to_datetime(since)
        end_day = pd.to_datetime(end)
        self.df = pd.read_excel("./Sentimental/%s-tweets-analysed.xlsx" % username, engine= 'openpyxl')
        self.df_filtered = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
        self.df_filtered_2020 = self.df[(self.df['created_at'] >= since_day) & (self.df['created_at'] <= end_day)]
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

        dict_2020 = {}
        dict_2020["neutral"] = self.df_filtered[self.df_filtered["polarity"] == 0].shape[0]
        dict_2020["weak_positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0) & (self.df_filtered["polarity"] <= 0.3)].shape[0]
        dict_2020["positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0.3) & (self.df_filtered["polarity"] <= 0.6)].shape[0]
        dict_2020["strong_positive"] = self.df_filtered[(self.df_filtered["polarity"] > 0.6) & (self.df_filtered["polarity"] <= 1)].shape[0]
        dict_2020["weak_negative"] = self.df_filtered[(self.df_filtered["polarity"] < 0) & (self.df_filtered["polarity"] >= -0.3)].shape[0]
        dict_2020["negative"] = self.df_filtered[(self.df_filtered["polarity"] < -0.3) & (self.df_filtered["polarity"] >= -0.6)].shape[0]
        dict_2020["strong_negative"] = self.df_filtered[(self.df_filtered["polarity"] < -0.6) & (self.df_filtered["polarity"] >= -1)].shape[0]

        dict_result = {
            "2020": dict_2020,
            "2021": dict,
        }

        return dict_result
