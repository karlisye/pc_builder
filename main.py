from dotenv import load_dotenv
from scraper.config import CATEGORIES
from scraper import database, parsers
import time

load_dotenv()


def main():
    print('Starting scraper...\n')

    conn = database.get_connection()
    if not conn:
        print('Failed to connect')
        return

    if not database.init_database(conn):
        print('Failed to initialize database')
        conn.close()
        return

    database.clear_tables(conn)
    print()

    total = 0
    for product_type, categories in CATEGORIES.items():
        for category_name, base_url in categories.items():
            count = parsers.scrape_category(category_name, base_url, product_type, conn)
            total += count
            print(f'{product_type}/{category_name}: {count} products saved\n')
            time.sleep(2)

    conn.close()
    print(f'Complete! Total: {total} products')


if __name__ == '__main__':
    main()