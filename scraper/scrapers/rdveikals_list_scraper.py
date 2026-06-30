import time
from bs4 import BeautifulSoup
from scrapers.base_scraper import fetch

BASE_URL = "https://www.rdveikals.lv"


def get_products(category_url: str, page_delay: float) -> list:
    """
    Scrape all pages of a rdveikals.lv category URL.

    category_url must follow the pattern:
        https://www.rdveikals.lv/categories/lv/{id}/sort/5/filter/0_0_0_0/page/1/{Name}.html

    Returns list of (name, brand, url, price, stock_status) tuples.
    stock_quantity is always None — the site does not expose it.
    """
    results = []
    page = 1

    # derive base for pagination by replacing /page/1/ with /page/{N}/
    if "/page/" not in category_url:
        raise ValueError(f"category_url must contain /page/: {category_url}")

    url_template = _page_url(category_url, "{page}")

    while True:
        url = url_template.replace("{page}", str(page))
        response = fetch(url)
        soup = BeautifulSoup(response.text, "html.parser")

        items = soup.select("li.product.js-product")
        if not items:
            break

        for li in items:
            name = li.get("data-prod-name", "").strip()
            brand = li.get("data-prod-brand", "").strip()

            price_str = li.get("data-prod-price", "").strip()
            try:
                price = float(price_str) if price_str else None
            except ValueError:
                price = None

            # relative href on the overlay anchor
            overlay = li.select_one("a.overlay")
            rel_href = overlay.get("href", "") if overlay else ""
            full_url = BASE_URL + "/" + rel_href.lstrip("/") if rel_href else None

            # stock status from availability span colour
            avail_success = li.select_one("span.text--color-success.available_link")
            avail_muted = li.select_one("span.text--color-text-small.available_link")
            if avail_success:
                stock_status = "in_stock"
            elif avail_muted:
                stock_status = "orderable"
            else:
                stock_status = "out_of_stock"

            if name:
                results.append((name, brand, full_url, price, stock_status))

        print(f"    Page {page}: {len(items)} products")

        # stop if no next-page link exists
        next_page_url = _page_url(category_url, str(page + 1))
        next_link = soup.find("a", href=lambda h: h and f"/page/{page + 1}/" in h)
        if not next_link:
            break

        page += 1
        time.sleep(page_delay)

    return results


def _page_url(base: str, page: str) -> str:
    """Replace the /page/{N}/ segment in a rdveikals category URL."""
    import re
    return re.sub(r"/page/\d+/", f"/page/{page}/", base)
