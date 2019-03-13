
def scrape_to_sql():

	import pandas as pd
	from sqlalchemy import create_engine

	url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'

	#read the html from the page and pass it to a dataframe
	#Regular page text is ignored by the read_html funcction
	#header = 0 sets the first row as the header
	#index of [0] at the end grabs only the first table from the page
	df = pd.read_html(url, header=0)[0]

	engine = create_engine('sqlite:///data/SPX_Constituents.sqlite')

	df.to_sql(name='constituents', con=engine, if_exists='append', index=False)


	### to read back the sql, verify it is working
	df = pd.read_sql('select * from constituents', con=engine)
	print(df.head(5))

scrape_to_sql()