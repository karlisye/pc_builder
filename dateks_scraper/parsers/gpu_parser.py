from utils.helpers import extract_number, parse_price

class GpuParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'gpu_model': specs.get('GPU modelis'),
      'gpu_speed': extract_number(specs.get('Dzinēja ātrums (GPU speed)')),
      'power_connector': specs.get('Barošanas ligzdas'),
      'memory': extract_number(specs.get('Operatīvā atmiņa')),
      'memory_type': specs.get('Atmiņas tehnoloģija'),
      'cooling': specs.get('Dzesēšana')
    }
