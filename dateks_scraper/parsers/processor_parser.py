from utils.helpers import extract_number, parse_price

class ProcessorParser:  
  def __init__(self, detail_scraper):
    self.detail_scraper = detail_scraper
  
  def parse(self, specs, category_name, name, price, avail, url):
    if url:
      detail_specs = self.detail_scraper.scrape_processor_details(url)
      specs.update(detail_specs)
    
    socket = specs.get('Socket', specs.get('Procesora ligzda'))
    if socket:
      socket = socket.replace('Socket ', '').strip()
    
    cooler_text = specs.get('Komplektā dzesētājs')
    cooler_included = 1 if cooler_text == 'Ir' else 0
    
    integrated_graphics = specs.get('Integrēta videokarte')
    
    if integrated_graphics:
      if integrated_graphics.lower() in ['nav']:
        integrated_graphics = None
      else:
        integrated_graphics = integrated_graphics.strip()
    
    return {
      'category': category_name,
      'name': name,
      'url': url,
      'price': parse_price(price),
      'availability': avail,
      'socket': socket,
      'processor_number': specs.get('Procesora numurs'),
      'cores': extract_number(specs.get('Performance kodolu skaits', specs.get('Kodolu skaits'))),
      'frequency': extract_number(specs.get('Takts frekvence')),
      'cache': extract_number(specs.get('Cache')),
      'lithography': extract_number(specs.get('Processing Die Lithography', specs.get('Semiconductor Fabrication Process'))),
      'tdp': extract_number(specs.get('TDP', specs.get('Thermal Design Power'))),
      'cooler_included': cooler_included,
      'integrated_graphics': integrated_graphics
    }