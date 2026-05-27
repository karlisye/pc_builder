import requests

HEADERS = {
    # makes requests look like they are coming from a real chrome browser instead of a script
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

# reuse the same tcp connection accross multiple requests
# auto keeps cookies
session = requests.Session()
session.headers.update(HEADERS)


def fetch(url: str) -> requests.Response:
    # follow redirects automatically (http to https), give up after 15s
    response = session.get(url, allow_redirects=True, timeout=15)
    # throws an error if page not found
    response.raise_for_status()
    return response
