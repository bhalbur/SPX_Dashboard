import pandas as pd
from sqlalchemy import create_engine

df = pd.read_csv('constituents_csv.csv')

engine = create_engine('sqlite:///data/SPX_Constituents.sqlite')

df.to_sql(name='constituents', con=engine, if_exists='replace', index=False)



### to read back the sql, verify it is working
df = pd.read_sql('select * from constituents', con=engine)
print(df.head(5))