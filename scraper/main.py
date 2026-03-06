import importlib
import time
from config import CATEGORIES, PAGE_DELAY
from database import get_connection, wipe_table
from scrapers.list_scraper import get_product_urls
from scrapers.detail_scraper import scrape_detail_page


def prompt_user():
    print("\nAvailable categories:")
    keys = list(CATEGORIES.keys())
    for i, key in enumerate(keys, 1):
        print(f"  {i}. {key}")
    print("  all. Scrape everything")
    choice = input("\nEnter category name(s) separated by comma, or 'all': ").strip().lower()
    if choice == "all":
        return keys
    selected = [c.strip() for c in choice.split(",")]
    invalid = [c for c in selected if c not in CATEGORIES]
    if invalid:
        print(f"Unknown categories: {invalid}")
        exit(1)
    return selected


def main():
    selected = prompt_user()
    conn = get_connection()
    scraped_at = time.strftime("%Y-%m-%d %H:%M:%S")

    print(f"\nStarting scrape at {scraped_at}")
    print(f"Categories: {', '.join(selected)}\n")

    for category_key in selected:
        config = CATEGORIES[category_key]
        table = config["table"]
        parser_module = importlib.import_module(f"parsers.{config['parser']}")

        print(f"[{category_key.upper()}] Wiping table '{table}'...")
        wipe_table(conn, table)

        all_urls = []
        for base_url in config["urls"]:
            print(f"  Collecting URLs from: {base_url}")
            urls = get_product_urls(base_url)
            all_urls.extend(urls)
            print(f"  Found {len(urls)} products")

        print(f"  Total: {len(all_urls)} products to scrape")

        for i, (dateks_id, url, price, in_stock, stock_quantity) in enumerate(all_urls, 1):
            print(f"  [{i}/{len(all_urls)}] Scraping: {url}")
            try:
                html = scrape_detail_page(url)
                data = parser_module.parse(
                    html, dateks_id, url, price, in_stock, stock_quantity, scraped_at
                )
                if data:
                    # Out-of-stock products ARE inserted. The builder uses in_stock
                    # as a filter at query time, not at scrape time. This preserves
                    # full catalogue data for display and future availability checks.
                    parser_module.insert(conn, data)
            except Exception as e:
                print(f"\n[ERROR] Failed on URL: {url}")
                print(f"[ERROR] {e}")
                conn.close()
                exit(1)
            time.sleep(PAGE_DELAY)

        print(f"  Done with {category_key.upper()}\n")

    conn.close()
    print("Scrape complete.")


if __name__ == "__main__":
    main()
