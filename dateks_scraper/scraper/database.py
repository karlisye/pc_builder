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
    cursor.execute("SHOW TABLES")
    tables = [table[0] for table in cursor.fetchall()]
    
    required_tables = [
      'processors', 'motherboards', 'rams', 'gpus', 'ssds',
      'hdds_35', 'hdds_25', 'cases', 'fans', 'psus', 'coolers'
    ]
    
    missing_tables = [t for t in required_tables if t not in tables]
    
    if missing_tables:
      print(f'Warning: Missing tables: {", ".join(missing_tables)}')
      print('Please run Laravel migrations: php artisan migrate')
      return False
    
    print('Database tables verified')
    return True
  except Error as e:
    print(f'Error checking database: {e}')
    return False


def clear_tables(conn):
  try:
    cursor = conn.cursor()
    cursor.execute('TRUNCATE TABLE processors')
    cursor.execute('TRUNCATE TABLE motherboards')
    cursor.execute('TRUNCATE TABLE rams')
    cursor.execute('TRUNCATE TABLE gpus')
    cursor.execute('TRUNCATE TABLE ssds')
    cursor.execute('TRUNCATE TABLE hdds_35')
    cursor.execute('TRUNCATE TABLE hdds_25')
    cursor.execute('TRUNCATE TABLE cases')
    cursor.execute('TRUNCATE TABLE fans')
    cursor.execute('TRUNCATE TABLE psus')
    cursor.execute('TRUNCATE TABLE coolers')
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
        category, name, url, price, availability, socket,
        processor_number, cores, frequency, cache,
        lithography, tdp, cooler_included
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
        category, name, url, price, availability, series,
        socket, chipset, form_factor, memory_type,
        memory_slots, wifi
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
      INSERT INTO rams (
        category, name, url, price, availability, capacity,
        frequency, memory_type, cas_latency, kit_type
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
        category, name, url, price, availability, gpu_model,
        gpu_speed, power_connector, memory, memory_type, cooling
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
      INSERT INTO ssds (
        category, name, url, price, availability, capacity,
        type, read_speed, write_speed, form_factor, interface
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
        category, name, url, price, availability, capacity,
        interface, rpm, cache
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
        category, name, url, price, availability, form_factor,
        case_type, color, psu_included
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
        category, name, url, price, availability, manufacturer,
        rpm_max, rpm_min, size, led_color, connector,
        quantity, noise_level
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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
      INSERT INTO psus (
        category, name, url, price, availability, manufacturer,
        wattage, certification, fan_size, modular,
        cpu_connector, pcie_connector
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
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


def save_cooler(conn, data):
  try:
    cursor = conn.cursor()
    cursor.execute('''
      INSERT INTO coolers (
        category, name, url, price, availability, manufacturer,
        height, tdp, cooler_class, led_color, fan_count
      ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
      data.get('category'),
      data.get('name'),
      data.get('url'),
      data.get('price'),
      data.get('availability'),
      data.get('manufacturer'),
      data.get('height'),
      data.get('tdp'),
      data.get('cooler_class'),
      data.get('led_color'),
      data.get('fan_count')
    ))
    conn.commit()
    return True
  except Error as e:
    print(f'Database error: {e}')
    return False
