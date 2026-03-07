import time
import re
from bs4 import BeautifulSoup
from scrapers.base_scraper import fetch
from config import PAGE_DELAY

BASE_URL = "https://www.dateks.lv"


def get_product_urls(base_url: str) -> list:
    results = []
    page = 0

    while True:
        if page == 0:
            url = base_url
        else:
            url = f"{base_url}/pg/{page}"

        response = fetch(url)
        final_url = response.url.rstrip("/")

        if page > 0:
            expected = f"{base_url}/pg/{page}".rstrip("/")
            if final_url != expected:
                break

        soup = BeautifulSoup(response.text, "html.parser")
        product_links = soup.select("a.imp[data-id]")

        if not product_links:
            break

        for link in product_links:
            dateks_id = int(link.get("data-id"))
            href = link.get("href")
            full_url = BASE_URL + href

            prod = link.find_parent(class_="prod")
            price = None
            in_stock = False
            stock_quantity = None

            if prod:
                price_tag = prod.select_one(".price")
                if price_tag:
                    price_text = (
                        price_tag.get_text(strip=True)
                        .replace("€", "")
                        .replace(",", ".")
                        .strip()
                    )
                    try:
                        price = float(price_text)
                    except ValueError:
                        price = None

                avail_tag = prod.select_one(".avail")
                if avail_tag:
                    avail_text = avail_tag.get_text(strip=True)
                    in_stock = avail_text.lower().startswith(
                        "in stock"
                    ) or avail_text.lower().startswith("in office")
                    qty_match = re.search(r"(>?\d+)\s+units", avail_text)
                    stock_quantity = qty_match.group(1) if qty_match else None

            results.append((dateks_id, full_url, price, in_stock, stock_quantity))

        print(f"    Page {page + 1}: {len(product_links)} products")
        page += 1
        time.sleep(PAGE_DELAY)

    return results
