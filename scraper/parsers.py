import requests
from bs4 import BeautifulSoup
import time
import re
from scraper import database


def extract_number(text):
    if not text:
        return None
    match = re.search(r'\d+', text)
    if match:
        return int(match.group())
    return None


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


def parse_processor_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'socket': specs.get('Socket', specs.get('Procesora ligzda')),
        'processor_number': specs.get('Procesora numurs'),
        'cores': extract_number(specs.get('Performance kodolu skaits', specs.get('Kodolu skaits'))),
        'frequency': extract_number(specs.get('Takts frekvence')),
        'cache': extract_number(specs.get('Cache')),
        'lithography': extract_number(specs.get('Processing Die Lithography')),
        'tdp': extract_number(specs.get('TDP', specs.get('Thermal Design Power'))),
        'cooler_included': specs.get('Komplektā dzesētājs', specs.get('Integrēta videokarte'))
    }


def parse_motherboard_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'series': specs.get('Sērija'),
        'socket': specs.get('Ligzda (socket)'),
        'chipset': specs.get('Mikroshēmu kopne (chipset)'),
        'form_factor': specs.get('Plates izmērs'),
        'memory_type': specs.get('Atmiņas tips'),
        'memory_slots': extract_number(specs.get('Atmiņas sloti')),
        'wifi': specs.get('Iebūvēts Wi-Fi')
    }


def parse_ram_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'capacity': extract_number(specs.get('Apjoms')),
        'frequency': extract_number(specs.get('Maksimālā takts frekvence')),
        'memory_type': specs.get('Atmiņas tips'),
        'cas_latency': extract_number(specs.get('CL')),
        'kit_type': specs.get('KIT')
    }

def parse_gpu_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'gpu_model': specs.get('GPU modelis'),
        'gpu_speed': extract_number(specs.get('Dzinēja ātrums (GPU speed)')),
        'power_connector': specs.get('Barošanas ligzdas'),
        'memory': extract_number(specs.get('Operatīvā atmiņa')),
        'memory_type': specs.get('Atmiņas tehnoloģija'),
        'cooling': specs.get('Dzesēšana')
    }



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

            if product_type == 'processors':
                product_data = parse_processor_data(specs, category_name, name, price, avail)
                success = database.save_processor(conn, product_data)
            elif product_type == 'motherboards':
                product_data = parse_motherboard_data(specs, category_name, name, price, avail)
                success = database.save_motherboard(conn, product_data)
            elif product_type == 'ram':
                product_data = parse_ram_data(specs, category_name, name, price, avail)
                success = database.save_ram(conn, product_data)
            elif product_type == 'gpus':
                product_data = parse_gpu_data(specs, category_name, name, price, avail)
                success = database.save_gpu(conn, product_data)

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