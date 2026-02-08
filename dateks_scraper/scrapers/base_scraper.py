import requests
from bs4 import BeautifulSoup

class BaseScraper:
  def __init__(self):
    self.base_url = 'https://www.dateks.lv'

  def fetch_page(self, url):
    response = requests.get(url)
    return BeautifulSoup(response.text, 'html.parser'), response.url

  def extract_specs(self, component):
    specs = {}
    fvs_container = component.find('div', class_='fvs')
    if fvs_container:
      for fv in fvs_container.find_all('div', class_='fv'):
        try:
          key = fv.find('span', class_='k').get_text(strip=True)
          value = fv.find('span', class_='v').get_text(strip=True)
          specs[key] = value
        except AttributeError:
          continue
    return specs

  def extract_product_basic_info(self, component):
    product_link = component.find('a', class_='imp')
    product_url = self.base_url + product_link['href'] if product_link else None
    name = component.find('span').get_text(strip=True)
    price = component.find('div', class_='price').get_text(strip=True)
    avail = component.find('div', class_='avail').get_text(strip=True)

    return {
      'url': product_url,
      'name': name,
      'price': price,
      'availability': avail
    }
