from utils.helpers import extract_number, parse_price

class PsuParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'manufacturer': specs.get('Ražotājs'),
      'wattage': extract_number(specs.get('Jauda')),
      'certification': specs.get('80 PLUS certification'),
      'fan_size': extract_number(specs.get('Ventilatora izmērs')),
      'modular': specs.get('Modulārie kabeļi'),
      'cpu_connector': specs.get('Procesora spraudnis'),
      'pcie_connector': specs.get('PCI-E')
    }
