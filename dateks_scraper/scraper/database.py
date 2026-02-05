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

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS gpus (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                gpu_model VARCHAR(100),
                gpu_speed INT,
                power_connector VARCHAR(50),
                memory INT,
                memory_type VARCHAR(50),
                cooling VARCHAR(100),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_gpu_model (gpu_model),
                INDEX idx_memory (memory)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ssd (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                capacity INT,
                type VARCHAR(50),
                read_speed INT,
                write_speed INT,
                form_factor VARCHAR(50),
                interface VARCHAR(100),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_capacity (capacity),
                INDEX idx_type (type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hdd_35 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                capacity INT,
                interface VARCHAR(100),
                rpm INT,
                cache INT,
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_capacity (capacity),
                INDEX idx_rpm (rpm)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hdd_25 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                capacity INT,
                interface VARCHAR(100),
                rpm INT,
                cache INT,
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_capacity (capacity),
                INDEX idx_rpm (rpm)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                form_factor VARCHAR(50),
                case_type VARCHAR(100),
                color VARCHAR(50),
                psu_included VARCHAR(50),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_form_factor (form_factor)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                manufacturer VARCHAR(100),
                rpm_max INT,
                rpm_min INT,
                size INT,
                led_color VARCHAR(50),
                connector VARCHAR(50),
                quantity INT,
                noise_level VARCHAR(50),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_size (size)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS psu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                manufacturer VARCHAR(100),
                wattage INT,
                certification VARCHAR(50),
                fan_size INT,
                modular VARCHAR(50),
                cpu_connector VARCHAR(100),
                pcie_connector VARCHAR(100),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_wattage (wattage),
                INDEX idx_certification (certification)
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
        cursor.execute('TRUNCATE TABLE gpus')
        cursor.execute('TRUNCATE TABLE ssd')
        cursor.execute('TRUNCATE TABLE hdd_35')
        cursor.execute('TRUNCATE TABLE hdd_25')
        cursor.execute('TRUNCATE TABLE cases')
        cursor.execute('TRUNCATE TABLE fans')
        cursor.execute('TRUNCATE TABLE psu')
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


def save_gpu(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO gpus (
                category, name, price, availability, gpu_model,
                gpu_speed, power_connector, memory, memory_type, cooling
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('gpu_model'),
            data.get('gpu_speed'),
            data.get('power_connector'),
            data.get('memory'),
            data.get('memory_type'),
            data.get('cooling')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_ssd(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ssd (
                category, name, price, availability, capacity,
                type, read_speed, write_speed, form_factor, interface
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('capacity'),
            data.get('type'),
            data.get('read_speed'),
            data.get('write_speed'),
            data.get('form_factor'),
            data.get('interface')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_hdd(conn, data, table_name):
    try:
        cursor = conn.cursor()
        cursor.execute(f'''
            INSERT INTO {table_name} (
                category, name, price, availability, capacity,
                interface, rpm, cache
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('capacity'),
            data.get('interface'),
            data.get('rpm'),
            data.get('cache')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_case(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO cases (
                category, name, price, availability, form_factor,
                case_type, color, psu_included
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('form_factor'),
            data.get('case_type'),
            data.get('color'),
            data.get('psu_included')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_fan(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fans (
                category, name, price, availability, manufacturer,
                rpm_max, rpm_min, size, led_color, connector,
                quantity, noise_level
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('manufacturer'),
            data.get('rpm_max'),
            data.get('rpm_min'),
            data.get('size'),
            data.get('led_color'),
            data.get('connector'),
            data.get('quantity'),
            data.get('noise_level')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False


def save_psu(conn, data):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO psu (
                category, name, price, availability, manufacturer,
                wattage, certification, fan_size, modular,
                cpu_connector, pcie_connector
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('category'),
            data.get('name'),
            data.get('price'),
            data.get('availability'),
            data.get('manufacturer'),
            data.get('wattage'),
            data.get('certification'),
            data.get('fan_size'),
            data.get('modular'),
            data.get('cpu_connector'),
            data.get('pcie_connector')
        ))
        conn.commit()
        return True
    except Error as e:
        print(f'Database error: {e}')
        return False