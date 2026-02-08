from utils.helpers import extract_number, parse_price

class RamParser:
  def parse(self, specs, category_name, name, price, avail, url):
    memory_type = specs.get('Atmiņas tips')
    if memory_type:
      memory_type = memory_type.strip()

    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'capacity': extract_number(specs.get('Apjoms')),
      'frequency': extract_number(specs.get('Maksimālā takts frekvence')),
      'memory_type': memory_type,
      'cas_latency': extract_number(specs.get('CL')),
      'kit_type': specs.get('KIT')
    }
