from utils.helpers import extract_number, parse_price

class MotherboardParser:
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
      'series': specs.get('Sērija'),
      'socket': specs.get('Ligzda (socket)'),
      'chipset': specs.get('Mikroshēmu kopne (chipset)'),
      'form_factor': specs.get('Plates izmērs'),
      'memory_type': memory_type,
      'memory_slots': extract_number(specs.get('Atmiņas sloti')),
      'wifi': specs.get('Iebūvēts Wi-Fi')
    }
