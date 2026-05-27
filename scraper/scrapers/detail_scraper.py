from scrapers.base_scraper import fetch

# return the html of a page
def scrape_detail_page(url: str) -> str:
    response = fetch(url)
    return response.text
