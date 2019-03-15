import os

import pandas as pd
import numpy as np
import pprint

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

#Custom function to scrape data from Wikipedia and save it in SQLite
from scrape_to_sql import scrape_to_sql


from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
engine = create_engine('sqlite:///data/SPX_Constituents.sqlite')


app = Flask(__name__)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/json")
def json():
    query_text = 'Select * from constituents'
    json_resp = pd.read_sql_query(query_text, engine).to_json(orient='records')
    return jsonify(json_resp)


@app.route("/scrape")
def scrape():
    #refresh the sql data
    scrape_to_sql()
    query_text = 'Select Symbol from constituents'
    tick = pd.read_sql_query(query_text, engine)
    tickerList = list(tick['Symbol'])
    return jsonify(tickerList)
    #This list should populate our dropdown of tickers






@app.route("/currentprice/<ticker>")
def currentprice(ticker):
  symbol = ticker
  response = requests.get(f'https://cloud.iexapis.com/beta/stock/{symbol1}/price/quote?token={API_KEY}')
  response_json = response.json()
  return(json.dumps(response_json, indent=4, sort_keys=True))






@app.route("/samples/<sample>")
def samples(sample):
    ### LEFTOVERS FROM PREVIOUS HOMEWORK
    ### LEFTOVERS FROM PREVIOUS HOMEWORK
    ### LEFTOVERS FROM PREVIOUS HOMEWORK
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1

    sample_data1 = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
    sample_data = sample_data1.sort_values(by=[sample])


    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run()
