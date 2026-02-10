from scrapers.base_scraper import BaseScraper

class DetailScraper(BaseScraper):
  def scrape_processor_details(self, product_url):
    try:
      soup, _ = self.fetch_page(product_url)
      all_fv = soup.find_all('div', class_='fv')
      specs = {}
      
      for fv in all_fv:
        try:
          k_span = fv.find('span', class_='k')
          v_span = fv.find('span', class_='v')
          if k_span and v_span:
            key_link = k_span.find('a')
            if key_link:
              key = key_link.get_text(strip=True)
            else:
              key = k_span.get_text(strip=True)
            value = v_span.get_text(strip=True)
            specs[key] = value
        except AttributeError:
          continue
      
      return specs
    except Exception as e:
      print(f'Error fetching processor details: {e}')
      return {}