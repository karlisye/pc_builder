from utils.helpers import extract_number, parse_price

class SsdParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'capacity': extract_number(specs.get('Apjoms')),
      'type': specs.get('Tips'),
      'read_speed': extract_number(specs.get('Lasīšanas ātrums (Seq. Read)')),
      'write_speed': extract_number(specs.get('Rakstīšanas ātrums (Seq. Write)')),
      'form_factor': specs.get('Formāts'),
      'interface': specs.get('Interfeiss')
    }
