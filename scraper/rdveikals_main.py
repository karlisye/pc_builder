"""
rdveikals.lv quick scraper

Usage:
    python3 rdveikals_main.py <category> <max_errors> <page_delay>

Example:
    python3 rdveikals_main.py gpu 5 0.3
"""

import sys
from datetime import datetime

from database import get_connection, upsert_listing, mark_missing_listings_out_of_stock
from scrapers.rdveikals_list_scraper import get_products
from name_lookup import find_product_code, clear_cache
from rdveikals_config import CATEGORIES, SOURCE


def run(category: str, max_errors: int, page_delay: float):
    if category not in CATEGORIES:
        print(f"Unknown category '{category}'. Available: {', '.join(CATEGORIES)}")
        sys.exit(1)

    cat = CATEGORIES[category]
    table = cat["table"]
    component_type = cat["component_type"]

    conn = get_connection()
    clear_cache()

    errors = 0
    seen_product_codes = []
    matched = 0
    unmatched = 0
    unmatched_names = []

    print(f"[rdveikals] Scraping category '{category}' → table '{table}'")

    for url in cat["urls"]:
        print(f"  URL: {url}")
        try:
            products = get_products(url, page_delay)
        except Exception as e:
            print(f"  [ERROR] Failed to scrape {url}: {e}")
            errors += 1
            if errors >= max_errors:
                print("  Max errors reached, aborting.")
                break
            continue

        scraped_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        for name, brand, prod_url, price, stock_status in products:
            product_code = find_product_code(conn, table, name, brand)

            if product_code is None:
                print(f"  [UNMATCHED] {brand} | {name}")
                unmatched += 1
                unmatched_names.append(f"{brand} | {name}")
                continue

            upsert_listing(
                conn,
                component_type=component_type,
                product_code=product_code,
                source=SOURCE,
                url=prod_url,
                price=price,
                stock_status=stock_status,
                stock_quantity=None,
                scraped_at=scraped_at,
            )
            seen_product_codes.append(product_code)
            matched += 1

    print(f"\n  Matched: {matched}  |  Unmatched: {unmatched}")
    if unmatched_names:
        print("  Unmatched names:")
        for n in unmatched_names:
            print(f"    - {n}")

    if seen_product_codes:
        mark_missing_listings_out_of_stock(conn, component_type, SOURCE, seen_product_codes)
        print(f"  Marked unseen {SOURCE} listings as out_of_stock.")

    conn.close()
    print("Done.")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 rdveikals_main.py <category> <max_errors> <page_delay>")
        sys.exit(1)

    _category = sys.argv[1]
    _max_errors = int(sys.argv[2])
    _page_delay = float(sys.argv[3])

    run(_category, _max_errors, _page_delay)
