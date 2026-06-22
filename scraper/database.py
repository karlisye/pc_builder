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

# insert data in db, or update the existing row (matched by dateks_id) if it's already there
def upsert_row(conn, table, data: dict):
    columns = ", ".join(f"`{k}`" for k in data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    update_cols = [k for k in data.keys() if k != "dateks_id"]
    update_clause = ", ".join(f"`{c}`=VALUES(`{c}`)" for c in update_cols)
    sql = (
        f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders}) "
        f"ON DUPLICATE KEY UPDATE {update_clause}"
    )
    cursor = conn.cursor()
    cursor.execute(sql, list(data.values()))
    conn.commit()
    cursor.close()

# update only price/availability fields for a product that's already in the db
# returns affected row count: 0 means the dateks_id wasn't found (product not scraped yet)
def update_price_stock(conn, table, dateks_id, price, stock_status, stock_quantity, scraped_at):
    sql = (
        f"UPDATE `{table}` SET price=%s, stock_status=%s, stock_quantity=%s, scraped_at=%s "
        f"WHERE dateks_id=%s"
    )
    cursor = conn.cursor()
    cursor.execute(sql, [price, stock_status, stock_quantity, scraped_at, dateks_id])
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    return affected

# mark rows whose dateks_id was not seen in the latest full scrape as out of stock
# (instead of deleting them, so specs/history are preserved for delisted products)
def mark_missing_out_of_stock(conn, table, seen_dateks_ids: list):
    if not seen_dateks_ids:
        return
    placeholders = ", ".join(["%s"] * len(seen_dateks_ids))
    sql = (
        f"UPDATE `{table}` SET stock_status='out_of_stock' "
        f"WHERE dateks_id NOT IN ({placeholders})"
    )
    cursor = conn.cursor()
    cursor.execute(sql, seen_dateks_ids)
    conn.commit()
    cursor.close()
