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

# insert data in db, or update the existing row (matched by product_code) if it's already there
def upsert_row(conn, table, data: dict):
    columns = ", ".join(f"`{k}`" for k in data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    update_cols = [k for k in data.keys() if k != "product_code"]
    update_clause = ", ".join(f"`{c}`=VALUES(`{c}`)" for c in update_cols)
    sql = (
        f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders}) "
        f"ON DUPLICATE KEY UPDATE {update_clause}"
    )
    cursor = conn.cursor()
    cursor.execute(sql, list(data.values()))
    conn.commit()
    cursor.close()

# insert a listing, or update it if one already exists for this (component_type, product_code, source)
def upsert_listing(conn, component_type, product_code, source, url, price, stock_status, stock_quantity, scraped_at):
    sql = (
        "INSERT INTO `listings` "
        "(component_type, product_code, source, url, price, stock_status, stock_quantity, scraped_at) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) "
        "ON DUPLICATE KEY UPDATE url=VALUES(url), price=VALUES(price), "
        "stock_status=VALUES(stock_status), stock_quantity=VALUES(stock_quantity), scraped_at=VALUES(scraped_at)"
    )
    cursor = conn.cursor()
    cursor.execute(
        sql,
        [component_type, product_code, source, url, price, stock_status, stock_quantity, scraped_at],
    )
    conn.commit()
    cursor.close()

# update only price/availability fields for a listing that's already in the db
# returns affected row count: 0 means this product/source wasn't found (not scraped yet)
def update_listing_price_stock(conn, component_type, product_code, source, price, stock_status, stock_quantity, scraped_at):
    sql = (
        "UPDATE `listings` SET price=%s, stock_status=%s, stock_quantity=%s, scraped_at=%s "
        "WHERE component_type=%s AND product_code=%s AND source=%s"
    )
    cursor = conn.cursor()
    cursor.execute(
        sql,
        [price, stock_status, stock_quantity, scraped_at, component_type, product_code, source],
    )
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    return affected

# mark listings whose product_code was not seen in the latest full scrape as out of stock
# (instead of deleting them, so specs/history are preserved for delisted products)
def mark_missing_listings_out_of_stock(conn, component_type, source, seen_product_codes: list):
    if not seen_product_codes:
        return
    placeholders = ", ".join(["%s"] * len(seen_product_codes))
    sql = (
        "UPDATE `listings` SET stock_status='out_of_stock' "
        f"WHERE component_type=%s AND source=%s AND product_code NOT IN ({placeholders})"
    )
    cursor = conn.cursor()
    cursor.execute(sql, [component_type, source, *seen_product_codes])
    conn.commit()
    cursor.close()
