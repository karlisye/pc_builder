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


def parse_ssd_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'capacity': extract_number(specs.get('Apjoms')),
        'type': specs.get('Tips'),
        'read_speed': extract_number(specs.get('Lasīšanas ātrums (Seq. Read)')),
        'write_speed': extract_number(specs.get('Rakstīšanas ātrums (Seq. Write)')),
        'form_factor': specs.get('Formāts'),
        'interface': specs.get('Interfeiss')
    }


def parse_hdd_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'capacity': extract_number(specs.get('Apjoms')),
        'interface': specs.get('Pieslēguma interfeiss'),
        'rpm': extract_number(specs.get('Apgriezieni')),
        'cache': extract_number(specs.get('Buferis'))
    }


def parse_case_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'form_factor': specs.get('Formfaktors'),
        'case_type': specs.get('Korpusa tips'),
        'color': specs.get('Krāsa'),
        'psu_included': specs.get('Barošanas bloks')
    }


def parse_fan_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'manufacturer': specs.get('Ražotājs'),
        'rpm_max': extract_number(specs.get('Apgriezieni (MAX), rpm')),
        'rpm_min': extract_number(specs.get('Apgriezieni (MIN), rpm')),
        'size': extract_number(specs.get('Izmērs, mm')),
        'led_color': specs.get('LED izgaismojuma krāsa'),
        'connector': specs.get('Savienojums'),
        'quantity': extract_number(specs.get('Skaits iepakojumā')),
        'noise_level': specs.get('Trošņa līmenis (MAX), dB(A)')
    }


def parse_psu_data(specs, category_name, name, price, avail):
    return {
        'category': category_name,
        'name': name,
        'price': price,
        'availability': avail,
        'manufacturer': specs.get('Ražotājs'),
        'wattage': extract_number(specs.get('Jauda')),
        'certification': specs.get('80 PLUS certification'),
        'fan_size': extract_number(specs.get('Ventilatora izmērs')),
        'modular': specs.get('Modulārie kabeļi'),
        'cpu_connector': specs.get('Procesora spraudnis'),
        'pcie_connector': specs.get('PCI-E')
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
            elif product_type == 'ssd':
                product_data = parse_ssd_data(specs, category_name, name, price, avail)
                success = database.save_ssd(conn, product_data)
            elif product_type == 'hdd_35':
                product_data = parse_hdd_data(specs, category_name, name, price, avail)
                success = database.save_hdd(conn, product_data, 'hdd_35')
            elif product_type == 'hdd_25':
                product_data = parse_hdd_data(specs, category_name, name, price, avail)
                success = database.save_hdd(conn, product_data, 'hdd_25')
            elif product_type == 'cases':
                product_data = parse_case_data(specs, category_name, name, price, avail)
                success = database.save_case(conn, product_data)
            elif product_type == 'fans':
                product_data = parse_fan_data(specs, category_name, name, price, avail)
                success = database.save_fan(conn, product_data)
            elif product_type == 'psu':
                product_data = parse_psu_data(specs, category_name, name, price, avail)
                success = database.save_psu(conn, product_data)
            else:
                success = False

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