import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# connection with db using credentials from .env
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        database=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )

# wipe selected table from db and reset auto increment
def wipe_table(conn, table):
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM `{table}`")
    cursor.execute(f"ALTER TABLE `{table}` AUTO_INCREMENT = 1")
    conn.commit()
    cursor.close()

# insert data in db
def insert_row(conn, table, data: dict):
    # build columns (url, price, stock_status...)
    columns = ", ".join(f"`{k}`" for k in data.keys())
    # build placeholders (%s, %s, %s...)
    placeholders = ", ".join(["%s"] * len(data))
    # create list of values ['a.com', 10, 'in_stock'...]
    values = list(data.values())
    sql = f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders})"
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
