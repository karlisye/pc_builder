from utils.helpers import extract_number, parse_price

class CoolerParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'manufacturer': specs.get('Ražotājs'),
      'height': extract_number(specs.get('Augstums, mm')),
      'tdp': extract_number(specs.get('Dzesēšanas kapacitāte (TDP), W')),
      'cooler_class': specs.get('Dzesētāja klase'),
      'led_color': specs.get('LED izgaismojuma krāsa'),
      'fan_count': extract_number(specs.get('Ventilatoru skaits'))
    }
