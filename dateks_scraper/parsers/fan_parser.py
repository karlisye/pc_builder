from utils.helpers import extract_number, parse_price

class FanParser:
  def parse(self, specs, category_name, name, price, avail, url):
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'manufacturer': specs.get('Ražotājs'),
      'rpm_max': extract_number(specs.get('Apgriezieni (MAX), rpm')),
      'rpm_min': extract_number(specs.get('Apgriezieni (MIN), rpm')),
      'size': extract_number(specs.get('Izmērs, mm')),
      'led_color': specs.get('LED izgaismojuma krāsa'),
      'connector': specs.get('Savienojums'),
      'quantity': extract_number(specs.get('Skaits iepakojumā')),
      'noise_level': specs.get('Trošņa līmenis (MAX), dB(A)')
    }
