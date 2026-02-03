import mysql.connector
from mysql.connector import Error
import os


def get_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        return conn
    except Error as e:
        print(f'Error connecting to MySQL: {e}')
        return None


def init_database(conn):
    try:
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS processors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                socket VARCHAR(100),
                processor_number VARCHAR(100),
                cores INT,
                frequency INT,
                cache INT,
                lithography INT,
                tdp INT,
                cooler_included VARCHAR(50),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_cores (cores),
                INDEX idx_frequency (frequency)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS motherboards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                series VARCHAR(100),
                socket VARCHAR(100),
                chipset VARCHAR(100),
                form_factor VARCHAR(50),
                memory_type VARCHAR(50),
                memory_slots INT,
                wifi VARCHAR(20),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_socket (socket),
                INDEX idx_chipset (chipset)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ram (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                capacity INT,
                frequency INT,
                memory_type VARCHAR(50),
                cas_latency INT,
                kit_type VARCHAR(100),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_capacity (capacity),
                INDEX idx_frequency (frequency)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        conn.commit()
        print('Database initialized')
        return True

    except Error as e:
        print(f'Error initializing database: {e}')
        return False


def clear_tables(conn):
    try:
        cursor = conn.cursor()
        cursor.execute('TRUNCATE TABLE processors')
        cursor.execute('TRUNCATE TABLE motherboards')
        cursor.execute('TRUNCATE TABLE ram')
        conn.commit()
        print('Cleared existing data')
        return True
    except Error as e:
        print(f'Error clearing tables: {e}')
        return False


def save_processor(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO processors (
                category, name, price, availability, socket, 
                processor_number, cores, frequency, cache, 
                lithography, tdp, cooler_included
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('socket'),
            data.get('processor_number'),
            data.get('cores'),
            data.get('frequency'),
            data.get('cache'),
            data.get('lithography'),
            data.get('tdp'),
            data.get('cooler_included')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_motherboard(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO motherboards (
                category, name, price, availability, series,
                socket, chipset, form_factor, memory_type,
                memory_slots, wifi
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('series'),
            data.get('socket'),
            data.get('chipset'),
            data.get('form_factor'),
            data.get('memory_type'),
            data.get('memory_slots'),
            data.get('wifi')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_ram(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ram (
                category, name, price, availability, capacity,
                frequency, memory_type, cas_latency, kit_type
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('capacity'),
            data.get('frequency'),
            data.get('memory_type'),
            data.get('cas_latency'),
            data.get('kit_type')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False