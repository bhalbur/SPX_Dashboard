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




@app.route("/metadata/<sample>")
def sample_metadata(sample):
   ### LEFTOVERS FROM PREVIOUS HOMEWORK
   ### LEFTOVERS FROM PREVIOUS HOMEWORK
   ### LEFTOVERS FROM PREVIOUS HOMEWORK

    """Return the MetaData for a given sample."""
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.ETHNICITY,
        Samples_Metadata.GENDER,
        Samples_Metadata.AGE,
        Samples_Metadata.LOCATION,
        Samples_Metadata.BBTYPE,
        Samples_Metadata.WFREQ,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["ETHNICITY"] = result[1]
        sample_metadata["GENDER"] = result[2]
        sample_metadata["AGE"] = result[3]
        sample_metadata["LOCATION"] = result[4]
        sample_metadata["BBTYPE"] = result[5]
        sample_metadata["WFREQ"] = result[6]

    print(sample_metadata)
    return jsonify(sample_metadata)


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
