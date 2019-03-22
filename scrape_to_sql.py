
def scrape_to_sql():

	import pandas as pd
	from sqlalchemy import create_engine
	import requests

	try:
		from googlekey import gkey
	except ImportError:
		from keys import gkey

	url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'

	#read the html from the page and pass it to a dataframe
	#Regular page text is ignored by the read_html funcction
	#header = 0 sets the first row as the header
	#index of [0] at the end grabs only the first table from the page
	df = pd.read_html(url, header=0)[0]

	## add columns for lat and long
	df['lat'] = 0
	df['lng'] = 0

	## pull lat and long for each from google maps API
	API_url = "https://maps.googleapis.com/maps/api/geocode/json"

	## loop through the rows
	for index, row in df.iterrows():
	    ##Set the target for the API to the name and location of the company
	    target = row['Security']+' '+row['Headquarters Location']
	    params = {"address": target, "key": gkey}
	    response = requests.get(API_url, params=params)

	    #pull the lat and lng variables and store them in the table
	    lat = response.json()["results"][0]["geometry"]["location"]["lat"]
	    lng = response.json()["results"][0]["geometry"]["location"]["lng"]
	    df.loc[index, 'lat'] = lat
	    df.loc[index, 'lng'] = lng

	    #print this to the console as it runs
	    print(index, target, lat, lng)


	## create the connection engine and push the dataframe to the sqlite server
	engine = create_engine('sqlite:///data/SPX_Constituents.sqlite')
	df.to_sql(name='constituents', con=engine, if_exists='replace', index=False)

	### to read back the sql, verify it is working
	df = pd.read_sql('select * from constituents', con=engine)
	print(df.head(5))