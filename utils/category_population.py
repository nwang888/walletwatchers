import csv
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('../sql/utils.db')
cur = conn.cursor()

# Create table
cur.execute('''
    CREATE TABLE IF NOT EXISTS CategoryDescription (
        category_primary VARCHAR(256) NOT NULL,
        category_detailed VARCHAR(256) NOT NULL,
        category_description VARCHAR(256) NOT NULL,
        PRIMARY KEY (category_detailed)
    )
''')

# Open CSV file and insert data into the table
with open('./category_info.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # Skip the header row
    cur.executemany("INSERT INTO CategoryDescription VALUES (?, ?, ?)", csv_reader)

# Commit changes and close connection
conn.commit()
conn.close()
