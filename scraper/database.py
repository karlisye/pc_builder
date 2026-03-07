import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        database=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )


def wipe_table(conn, table):
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM `{table}`")
    cursor.execute(f"ALTER TABLE `{table}` AUTO_INCREMENT = 1")
    conn.commit()
    cursor.close()


def insert_row(conn, table, data: dict):
    columns = ", ".join(f"`{k}`" for k in data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = list(data.values())
    sql = f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders})"
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
