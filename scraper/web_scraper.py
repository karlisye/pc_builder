import requests
from bs4 import BeautifulSoup
import time
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os


CATEGORIES = {
    'intel': 'https://www.dateks.lv/cenas/procesori-intel',
    'amd': 'https://www.dateks.lv/cenas/procesori-amd',
}

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

def init_database():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS processors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50),
                name VARCHAR(255),
                price VARCHAR(50),
                availability TEXT,
                socket VARCHAR(100),
                processor_number VARCHAR(100),
                cores VARCHAR(20),
                frequency VARCHAR(50),
                cache VARCHAR(50),
                lithography VARCHAR(50),
                tdp VARCHAR(50),
                cooler_included VARCHAR(50),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)

        conn.commit()
        print("Database initialized successfully")
        return conn

    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def save_to_database(conn, product_data):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO processors (
                category, name, price, availability, socket, 
                processor_number, cores, frequency, cache, 
                lithography, tdp, cooler_included
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            product_data.get('category'),
            product_data.get('name'),
            product_data.get('price'),
            product_data.get('availability'),
            product_data.get('Socket', product_data.get('Procesora ligzda')),
            product_data.get('Procesora numurs'),
            product_data.get('Performance kodolu skaits', product_data.get('Kodolu skaits')),
            product_data.get('Takts frekvence'),
            product_data.get('Cache'),
            product_data.get('Processing Die Lithography', product_data.get('Semiconductor Fabrication Process')),
            product_data.get('TDP', product_data.get('Thermal Design Power')),
            product_data.get('Komplektā dzesētājs', product_data.get('Integrēta videokarte'))
        ))

        conn.commit()
        return True

    except Error as e:
        print(f"Database error: {e}")
        return False

def extract_specs(component):
    specs = {}
    fvs_container = component.find('div', class_='fvs')

    if fvs_container:
        for fv in fvs_container.find_all('div', class_='fv'):
            try:
                key = fv.find('span', class_='k').get_text(strip=True)
                value = fv.find('span', class_='v').get_text(strip=True)
                specs[key] = value
            except AttributeError:
                continue

    return specs

def scrape_page(url, page_num, category_name, conn):
    response = requests.get(url)

    if response.url != url:
        print(f"[{category_name}] Page {page_num} doesn't exist.")
        return 0, True

    soup = BeautifulSoup(response.text, 'html.parser')
    components = soup.find_all('div', class_='prod')

    if not components:
        print(f"[{category_name}] No products found on page {page_num}")
        return 0, True

    count = 0
    for component in components:
        try:
            name = component.find('span').get_text(strip=True)
            price = component.find('div', class_='price').get_text(strip=True)
            avail = component.find('div', class_='avail').get_text(strip=True)
            specs = extract_specs(component)

            product_data = {
                'category': category_name,
                'name': name,
                'price': price,
                'availability': avail,
                **specs
            }

            if save_to_database(conn, product_data):
                count += 1
                print(f"[{category_name}] Saved: {name} | {price}")

        except Exception as e:
            print(f"[{category_name}] Error: {e}")
            continue

    return count, False

def scrape_category(category_name, base_url, conn):
    print(f"\n{'='*70}")
    print(f"Scraping: {category_name.upper()}")
    print(f"{'='*70}\n")

    total_count = 0

    count, should_stop = scrape_page(base_url, 1, category_name, conn)
    total_count += count

    if should_stop:
        return total_count

    page_num = 2
    while True:
        url = f'{base_url}/pg/{page_num}'
        count, should_stop = scrape_page(url, page_num, category_name, conn)
        total_count += count

        if should_stop:
            break

        page_num += 1
        time.sleep(1)

    return total_count

if __name__ == "__main__":
    print("Starting Dateks scraper with MySQL database...\n")

    conn = init_database()

    if not conn:
        print("Failed to connect to database. Exiting.")
        exit(1)

    total_products = 0

    for category_name, base_url in CATEGORIES.items():
        count = scrape_category(category_name, base_url, conn)
        total_products += count
        print(f"\n✓ {category_name}: {count} products saved")
        time.sleep(2)

    conn.close()

    print(f"\n{'='*70}")
    print(f"COMPLETE! Total: {total_products} products saved to MySQL")
    print(f"{'='*70}")