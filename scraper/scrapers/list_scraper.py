import time
import re
from bs4 import BeautifulSoup
from scrapers.base_scraper import fetch
from config import PAGE_DELAY

BASE_URL = "https://www.dateks.lv"


def get_product_urls(base_url: str) -> list:
    """Paginate a category listing page and collect all product tuples.

    Returns list of (dateks_id, full_url, price, in_stock, stock_quantity).

    Pagination: page 0 = base_url, page 1 = base_url/pg/1, etc.
    End detection: dateks.lv redirects back to the previous page when the
    requested page number exceeds available pages — we detect this by
    comparing the final URL after redirects to the expected URL.
    """
    results = []
    page = 0  # 0 = first page (no /pg/ suffix), 1 = /pg/1, etc.

    while True:
        if page == 0:
            url = base_url
        else:
            url = f"{base_url}/pg/{page}"

        response = fetch(url)
        final_url = response.url.rstrip("/")

        # Detect redirect back — means we've gone past the last page
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

            # Get the parent .prod container for price and availability
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
                    # Extract quantity e.g. ">50" or "37"
                    qty_match = re.search(r'(>?\d+)\s+units', avail_text)
                    stock_quantity = qty_match.group(1) if qty_match else None

            results.append((dateks_id, full_url, price, in_stock, stock_quantity))

        print(f"    Page {page + 1}: {len(product_links)} products")
        page += 1
        time.sleep(PAGE_DELAY)

    return results
