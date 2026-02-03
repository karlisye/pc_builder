import requests
from bs4 import BeautifulSoup
import time
from scraper import database


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


def scrape_page(url, page_num, category_name, product_type, conn):
    response = requests.get(url)

    if response.url != url:
        print(f'[{product_type}/{category_name}] Page {page_num} does not exist')
        return 0, True

    soup = BeautifulSoup(response.text, 'html.parser')
    components = soup.find_all('div', class_='prod')

    if not components:
        print(f'[{product_type}/{category_name}] No products on page {page_num}')
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

            if product_type == 'processors':
                success = database.save_processor(conn, product_data)
            elif product_type == 'motherboards':
                success = database.save_motherboard(conn, product_data)
            elif product_type == 'ram':
                success = database.save_ram(conn, product_data)

            if success:
                count += 1
                print(f'[{product_type}/{category_name}] {name} | {price}')

        except Exception as e:
            print(f'[{product_type}/{category_name}] Error: {e}')
            continue

    return count, False


def scrape_category(category_name, base_url, product_type, conn):
    print(f'\nScraping: {product_type.upper()} - {category_name.upper()}')

    total_count = 0
    count, should_stop = scrape_page(base_url, 1, category_name, product_type, conn)
    total_count += count

    if should_stop:
        return total_count

    page_num = 2
    while True:
        url = f'{base_url}/pg/{page_num}'
        count, should_stop = scrape_page(url, page_num, category_name, product_type, conn)
        total_count += count

        if should_stop:
            break

        page_num += 1
        time.sleep(1)

    return total_count
