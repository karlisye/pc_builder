from scrapers.base_scraper import fetch


def scrape_detail_page(url: str) -> str:
    response = fetch(url)
    return response.text
