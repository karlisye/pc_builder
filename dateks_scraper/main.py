import time
from config import CATEGORIES
from database import get_connection, init_database, clear_tables
import database
from scrapers import BaseScraper, DetailScraper
from parsers import (
  ProcessorParser, MotherboardParser, RamParser, GpuParser,
  SsdParser, HddParser, CaseParser, FanParser, PsuParser, CoolerParser
)

def scrape_page(url, page_num, category_name, product_type, conn, scraper, parsers):
  soup, final_url = scraper.fetch_page(url)

  if final_url != url:
    print(f'[{product_type}/{category_name}] Page {page_num} does not exist')
    return 0, True

  components = soup.find_all('div', class_='prod')
  if not components:
    print(f'[{product_type}/{category_name}] No products on page {page_num}')
    return 0, True

  count = 0
  parser = parsers.get(product_type)

  for component in components:
    try:
      basic_info = scraper.extract_product_basic_info(component)
      specs = scraper.extract_specs(component)

      product_data = parser.parse(
        specs, 
        category_name, 
        basic_info['name'], 
        basic_info['price'], 
        basic_info['availability'], 
        basic_info['url']
      )

      success = save_product(conn, product_type, product_data)

      if success:
        count += 1
        print(f'[{product_type}/{category_name}] {basic_info["name"]} | {basic_info["price"]}')

    except Exception as e:
      print(f'[{product_type}/{category_name}] Error: {e}')
      continue

  return count, False

def save_product(conn, product_type, data):
  save_functions = {
    'processors': database.save_processor,
    'motherboards': database.save_motherboard,
    'ram': database.save_ram,
    'gpus': database.save_gpu,
    'ssd': database.save_ssd,
    'hdd_35': lambda c, d: database.save_hdd(c, d, 'hdds_35'),
    'hdd_25': lambda c, d: database.save_hdd(c, d, 'hdds_25'),
    'cases': database.save_case,
    'fans': database.save_fan,
    'psu': database.save_psu,
    'coolers': database.save_cooler,
  }

  save_func = save_functions.get(product_type)
  return save_func(conn, data) if save_func else False

def scrape_category(category_name, base_url, product_type, conn, scraper, parsers):
  print(f'\nScraping: {product_type.upper()} - {category_name.upper()}')
  total_count = 0

  count, should_stop = scrape_page(base_url, 1, category_name, product_type, conn, scraper, parsers)
  total_count += count

  if should_stop:
    return total_count

  page_num = 2
  while True:
    url = f'{base_url}/pg/{page_num}'
    count, should_stop = scrape_page(url, page_num, category_name, product_type, conn, scraper, parsers)
    total_count += count

    if should_stop:
      break

    page_num += 1
    time.sleep(1)

  return total_count

def main():
  conn = get_connection()
  if not conn:
    return

  if not init_database(conn):
    return

  clear_tables(conn)

  base_scraper = BaseScraper()
  detail_scraper = DetailScraper()

  parsers = {
    'processors': ProcessorParser(detail_scraper),
    'motherboards': MotherboardParser(),
    'ram': RamParser(),
    'gpus': GpuParser(),
    'ssd': SsdParser(),
    'hdd_35': HddParser(),
    'hdd_25': HddParser(),
    'cases': CaseParser(),
    'fans': FanParser(),
    'psu': PsuParser(),
    'coolers': CoolerParser(),
  }

  for product_type, categories in CATEGORIES.items():
    for category_name, url in categories.items():
      count = scrape_category(category_name, url, product_type, conn, base_scraper, parsers)
      print(f'Total {product_type}/{category_name}: {count} products')

  conn.close()
  print('\nScraping completed')

if __name__ == '__main__':
  main()
