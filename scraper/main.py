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
    # list all available categories
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
    # split user prompt into an array
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

    # connect to the db
    conn = get_connection()
    scraped_at = time.strftime("%Y-%m-%d_%H:%M:%S")

    # print meta data for later use in frontend using [META] tag
    print(f"\n[META] start_time={scraped_at}")
    print(f"[META] categories={','.join(selected)}")
    print(f"Categories: {', '.join(selected)}\n")

    for category_key in selected:
        # fetch component category urls, parser and table
        config = CATEGORIES[category_key]
        table = config["table"]
        # import the component parser
        parser_module = importlib.import_module(f"parsers.{config['parser']}")

        # wipe component table from db
        print(f"[{category_key.upper()}] Wiping table '{table}'...")
        wipe_table(conn, table)

        all_urls = []
        for base_url in config["urls"]:
            print(f"  Collecting URLs from: {base_url}")
            # fetch global metadata for each component (url, price, stock_status, stock_quantity, dateks_id)
            urls = get_product_urls(base_url)
            all_urls.extend(urls)
            print(f"  Found {len(urls)} products")

        print(f"[META] total_{category_key}={len(all_urls)}")

        error_count = 0
        skipped = []

        # iterate over all_urls with index starting from 1
        for i, (dateks_id, url, price, stock_status, stock_quantity) in enumerate(
            all_urls, 1
        ):
            print(f"  [{i}/{len(all_urls)}] Scraping: {url}")
            try:
                # load the html from detail page of each product
                html = scrape_detail_page(url)
                # use the specific parser to get all necessary data for each product
                data = parser_module.parse(
                    html, dateks_id, url, price, stock_status, stock_quantity, scraped_at
                )
                if data:
                    # insert data in db
                    parser_module.insert(conn, data)
            except Exception as e:
                if hasattr(e, "errno") and e.errno == 1062:
                    print(f"  [DUP] {url}")
                    continue
                
                # save the error if found
                error_count += 1
                skipped.append((url, str(e)))
                print(f"  [SKIP {error_count}/{max_errors}] {url}")
                print(f"  [SKIP] {e}")
                # stop scraping for specific category once error limit reached
                if error_count >= max_errors:
                    print(
                        f"\n[ABORT] {category_key.upper()} reached {max_errors} errors. Stopping category."
                    )
                    break
            
            # scrape delay after each page
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

    # close the connection with db
    conn.close()
    finished_at = time.strftime("%Y-%m-%d_%H:%M:%S")
    print("Scrape complete.")
    print(f"[META] done=true")
    print(f"[META] finished_at={finished_at}")


if __name__ == "__main__":
    main()
