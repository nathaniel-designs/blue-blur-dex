import requests
import pandas as pd

url = 'https://blue-blur-db-l9xbv.ondigitalocean.app/plushies/all'

df = pd.read_json(url)
df.to_csv("plushies.csv", index=False)