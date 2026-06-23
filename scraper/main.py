import importlib
import time
import sys
from config import CATEGORIES, PAGE_DELAY, MAX_ERRORS_PER_CATEGORY, SOURCE
from database import (
    get_connection,
    mark_missing_listings_out_of_stock,
    update_listing_price_stock,
    upsert_listing,
)
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


def prompt_mode():
    choice = (
        input("\nRun full scrape or quick (price/availability only)? [full/quick] (default full): ")
        .strip()
        .lower()
    )
    if choice == "":
        return "full"
    if choice not in ("full", "quick"):
        print(f"Unknown mode: {choice!r}. Use 'full' or 'quick'.")
        sys.exit(1)
    return choice


def main():
    if len(sys.argv) > 1:
        selected = get_selected_from_args()
        max_errors = int(sys.argv[2] if len(sys.argv) > 2 else MAX_ERRORS_PER_CATEGORY)
        page_delay = float(sys.argv[3] if len(sys.argv) > 3 else PAGE_DELAY)
        mode = sys.argv[4].strip().lower() if len(sys.argv) > 4 else "full"

    else:
        selected = prompt_user()
        max_errors = MAX_ERRORS_PER_CATEGORY
        page_delay = PAGE_DELAY
        mode = prompt_mode()

    if mode not in ("full", "quick"):
        print(f"Unknown mode: {mode!r}. Use 'full' or 'quick'.")
        sys.exit(1)

    # connect to the db
    conn = get_connection()
    scraped_at = time.strftime("%Y-%m-%d_%H:%M:%S")

    # print meta data for later use in frontend using [META] tag
    print(f"\n[META] start_time={scraped_at}")
    print(f"[META] categories={','.join(selected)}")
    print(f"[META] mode={mode}")
    print(f"Categories: {', '.join(selected)}\n")

    for category_key in selected:
        # fetch component category urls, parser and table
        config = CATEGORIES[category_key]
        table = config["table"]
        # import the component parser
        parser_module = importlib.import_module(f"parsers.{config['parser']}")

        print(f"[{category_key.upper()}] Mode: {mode}")

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
        seen_product_codes = []

        # iterate over all_urls with index starting from 1
        for i, (product_code, url, price, stock_status, stock_quantity) in enumerate(
            all_urls, 1
        ):
            print(f"  [{i}/{len(all_urls)}] Scraping: {url}")

            if not product_code:
                print(f"  [SKIP] {url} (no product code found on listing page)")
                skipped.append((url, "no product code found"))
                continue

            seen_product_codes.append(product_code)
            try:
                if mode == "quick":
                    # update only price/availability, skip detail page fetch + parsing
                    affected = update_listing_price_stock(
                        conn, table, product_code, SOURCE, price, stock_status, stock_quantity, scraped_at
                    )
                    if affected == 0:
                        print(f"  [SKIP-NEW] {url} (not in db yet, run a full scrape first)")
                        skipped.append((url, "not in db yet"))
                else:
                    # load the html from detail page of each product
                    html = scrape_detail_page(url)
                    # use the specific parser to get specs for the product table
                    data = parser_module.parse(html, product_code, url, scraped_at)
                    if data:
                        # insert or update specs, and the price/stock listing separately
                        parser_module.insert(conn, data)
                        upsert_listing(
                            conn, table, product_code, SOURCE, url, price, stock_status, stock_quantity, scraped_at
                        )
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

        if mode == "full":
            # mark listings that were not found in this run as out of stock (delisted)
            mark_missing_listings_out_of_stock(conn, table, SOURCE, seen_product_codes)

        processed = i - len(skipped)
        verb = "updated" if mode == "quick" else "inserted"
        print(
            f"\n  [{category_key.upper()}] Done: {processed} {verb}, {len(skipped)} skipped"
        )
        print(f"[META] {verb}_{category_key}={processed} skipped_{category_key}={len(skipped)}")
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
