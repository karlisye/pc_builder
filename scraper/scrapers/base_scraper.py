import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

session = requests.Session()
session.headers.update(HEADERS)


def fetch(url: str) -> requests.Response:
    response = session.get(url, allow_redirects=True, timeout=15)
    response.raise_for_status()
    return response
