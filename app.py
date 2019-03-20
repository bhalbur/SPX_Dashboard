import os

import pandas as pd
import numpy as np
import pprint
import requests
import json
from googlekey import API_KEY


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

@app.route("/scrape")
def scrape():
    #refresh the sql data
    scrape_to_sql()
    query_text = 'Select Symbol from constituents'
    tick = pd.read_sql_query(query_text, engine)
    tickerList = list(tick['Symbol'])
    return jsonify(tickerList)
    #This list should populate our dropdown of tickers

@app.route("/names")
def names():
    query_text = 'Select Symbol from constituents'
    tick = pd.read_sql_query(query_text, engine)
    tickerList = list(tick['Symbol'])
    return jsonify(tickerList)

@app.route("/allData")
def allData():
    query_text = 'Select * from constituents'
    allData = pd.read_sql_query(query_text, engine)
    constituents = allData.to_json(orient='records')
    return constituents

@app.route('/basic/<ticker>')
def basic(ticker):
    query_text = f"Select Security, Symbol, [GICS Sector], [Headquarters Location], Founded from constituents where Symbol = '{ticker}'"
    basics = pd.read_sql_query(query_text, engine)
    info = basics.to_json(orient='records')
    return info



@app.route('/ticker_info/<ticker>')
def ticker_info(ticker):
    current_price_response = requests.get(f'https://cloud.iexapis.com/beta/stock/{ticker}/price/quote?token={API_KEY}')
    current_price = current_price_response.json()
    data = [{'current_price': str(current_price)}]

    historical_data_response = requests.get(f'https://cloud.iexapis.com/beta/stock/{ticker}/chart/1y/quote?token={API_KEY}' )
    historical_data = historical_data_response.json()
    data = data + historical_data

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
