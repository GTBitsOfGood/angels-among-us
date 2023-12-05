import pandas as pd
from pymongo import MongoClient

#Replace FILE_PATH and DB_URI with the path to your file and the URI to your database
#You'll need to also pip install pymongo, openpyxl, and pandas

class AccountImporter:

    def __init__(self):
        FILE_PATH = ""
        DB_URI = ""

        accounts_df = pd.read_excel(FILE_PATH)
        accounts_list = accounts_df.values.tolist()

        
        client = MongoClient(DB_URI)
        
        db = client['accounts']
        collection = db['accounts']

        for account in accounts_list:
            try:
                collection.insert_one({
                    "email": account[1],
                    "role": "Volunteer"
                })
            except:
                print("Error inserting account: " + account[1])
                continue


if __name__ == "__main__":
    AccountImporter()