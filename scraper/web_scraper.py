import requests
from bs4 import BeautifulSoup
import time
import csv

def scrape_page(url, page_num):
    """Scrape processors from a single page"""
    response = requests.get(url)

    if response.url != url:
        print(f"Page {page_num} doesn't exist. Redirected to: {response.url}")
        return None, True

    soup = BeautifulSoup(response.text, 'html.parser')
    components = soup.find_all('div', class_='prod')

    if not components:
        print(f"No products found on page {page_num}")
        return None, True

    page_data = []
    for component in components:
        try:
            name = component.find('span').get_text(strip=True)
            price = component.find('div', class_='price').get_text(strip=True)
            avail = component.find('div', class_='avail').get_text(strip=True)

            page_data.append({
                'name': name,
                'price': price,
                'availability': avail
            })

            print(f"{name} | {price} | {avail}")
        except AttributeError as e:
            print(f"Error parsing component: {e}")
            continue

    return page_data, False

def scrape_all_pages():
    """Scrape all pages of Intel processors"""
    base_url = 'https://www.dateks.lv/cenas/procesori-intel'
    all_data = []

    print("=" * 60)
    print("Scraping page 1...")
    print("=" * 60)

    page_data, should_stop = scrape_page(base_url, 1)
    if page_data:
        all_data.extend(page_data)

    if should_stop:
        return all_data

    print(f"\nFound {len(page_data)} products on page 1\n")

    index = 2

    while True:
        url = f'{base_url}/pg/{index}'

        print("=" * 60)
        print(f"Scraping page {index}: {url}")
        print("=" * 60)

        page_data, should_stop = scrape_page(url, index)

        if should_stop:
            print(f"\nStopping at page {index}")
            break

        if page_data:
            all_data.extend(page_data)
            print(f"\nFound {len(page_data)} products on page {index}\n")

        index += 1
        time.sleep(1)

    return all_data

if __name__ == "__main__":
    print("Starting Intel processor scraper...")
    print()

    all_processors = scrape_all_pages()

    print("=" * 60)
    print(f"Scraping complete! Total products found: {len(all_processors)}")
    print("=" * 60)

    if all_processors:
        csv_filename = 'intel_processors.csv'
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'price', 'availability'])
            writer.writeheader()
            writer.writerows(all_processors)

        print(f"\nData saved to {csv_filename}")
    else:
        print("\nNo data to save")