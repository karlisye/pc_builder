from scrapers.base_scraper import fetch

# return the html of a page
def scrape_detail_page(url: str) -> str:
    # detail pages must be fetched in Latvian: #params keys are Latvian and
    # the .original block (EAN, brand, etc.) is only present/shaped correctly there
    url = url.replace("/en/cenas/", "/cenas/", 1)
    response = fetch(url)
    return response.text
