from utils.helpers import extract_number, parse_price

class HddParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'capacity': extract_number(specs.get('Apjoms')),
      'interface': specs.get('Pieslēguma interfeiss'),
      'rpm': extract_number(specs.get('Apgriezieni')),
      'cache': extract_number(specs.get('Buferis'))
    }
