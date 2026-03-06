from scrapers.base_scraper import fetch


def scrape_detail_page(url: str) -> str:
    """Fetch a product detail page and return raw HTML."""
    response = fetch(url)
    return response.text
