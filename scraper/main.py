import importlib
import time
import sys
from config import CATEGORIES, PAGE_DELAY, MAX_ERRORS_PER_CATEGORY
from database import get_connection, wipe_table
from scrapers.list_scraper import get_product_urls
from scrapers.detail_scraper import scrape_detail_page

# support for command line arguments
def get_selected_from_args():
    keys = list(CATEGORIES.keys())
    arg = sys.argv[1].strip().lower()
    if arg == "all":
        return keys
    selected = [c.strip() for c in arg.split(',')]
    invalid = [c for c in selected if c not in CATEGORIES]
    if invalid:
        print(f"Unknown categories: {invalid}")
        sys.exit(1)
    return selected

def prompt_user():
    print("\nAvailable categories:")
    keys = list(CATEGORIES.keys())
    for i, key in enumerate(keys, 1):
        print(f"  {i}. {key}")
    print("  11. all")
    choice = (
        input("\nEnter category name(s) separated by comma, or 'all': ").strip().lower()
    )
    if choice == "all":
        return keys
    selected = [c.strip() for c in choice.split(",")]
    invalid = [c for c in selected if c not in CATEGORIES]
    if invalid:
        print(f"Unknown categories: {invalid}")
        exit(1)
    return selected


def main():
    if len(sys.argv) > 1:
        selected = get_selected_from_args()
        max_errors = int(sys.argv[2] if len(sys.argv) > 2 else MAX_ERRORS_PER_CATEGORY)
        page_delay = float(sys.argv[3] if len(sys.argv) > 3 else PAGE_DELAY)

    else:
        selected = prompt_user()
        max_errors = MAX_ERRORS_PER_CATEGORY
        page_delay = PAGE_DELAY

    conn = get_connection()
    scraped_at = time.strftime("%Y-%m-%d_%H:%M:%S")

    print(f"\n[META] start_time={scraped_at}")
    print(f"[META] categories={','.join(selected)}")
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

        print(f"[META] total_{category_key}={len(all_urls)}")

        error_count = 0
        skipped = []

        for i, (dateks_id, url, price, stock_status, stock_quantity) in enumerate(
            all_urls, 1
        ):
            print(f"  [{i}/{len(all_urls)}] Scraping: {url}")
            try:
                html = scrape_detail_page(url)
                data = parser_module.parse(
                    html, dateks_id, url, price, stock_status, stock_quantity, scraped_at
                )
                if data:
                    parser_module.insert(conn, data)
            except Exception as e:
                if hasattr(e, "errno") and e.errno == 1062:
                    print(f"  [DUP] {url}")
                    continue

                error_count += 1
                skipped.append((url, str(e)))
                print(f"  [SKIP {error_count}/{max_errors}] {url}")
                print(f"  [SKIP] {e}")
                if error_count >= max_errors:
                    print(
                        f"\n[ABORT] {category_key.upper()} reached {max_errors} errors. Stopping category."
                    )
                    break

            time.sleep(page_delay)

        inserted = i - error_count
        print(
            f"\n  [{category_key.upper()}] Done: {inserted} inserted, {error_count} skipped"
        )
        print(f"[META] inserted_{category_key}={inserted} skipped_{category_key}={error_count}")
        if skipped:
            print(f"  Skipped URLs:")
            for url, err in skipped:
                print(f"    [{url}] {err}")
        print()

    conn.close()
    print("Scrape complete.")
    print(f"[META] done=true")


if __name__ == "__main__":
    main()
