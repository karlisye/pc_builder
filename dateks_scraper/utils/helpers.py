import re

def extract_number(text):
  if not text:
    return None
  match = re.search(r'\d+', text)
  if match:
    return int(match.group())
  return None

def parse_price(price_text):
  if not price_text:
    return None
  price = str(price_text).replace('€', '').replace(' ', '').strip()
  price = price.replace(',', '.')
  try:
    return float(price)
  except:
    return None
