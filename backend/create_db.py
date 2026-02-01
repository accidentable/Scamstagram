import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to default postgres database
conn = psycopg2.connect(
    host="localhost",
    port="5432",
    user="postgres",
    password="postgres",
    database="postgres"
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

cursor = conn.cursor()

# Check if database exists
cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'scamstagram'")
exists = cursor.fetchone()

if not exists:
    cursor.execute("CREATE DATABASE scamstagram")
    print("Database 'scamstagram' created successfully!")
else:
    print("Database 'scamstagram' already exists.")

cursor.close()
conn.close()
