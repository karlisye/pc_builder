from utils.helpers import parse_price

class CaseParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'form_factor': specs.get('Formfaktors'),
      'case_type': specs.get('Korpusa tips'),
      'color': specs.get('Krāsa'),
      'psu_included': specs.get('Barošanas bloks')
    }
