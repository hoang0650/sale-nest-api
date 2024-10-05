import requests
from bs4 import BeautifulSoup

def scrape_text_from_url(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    text = ' '.join([p.text for p in soup.find_all('p')])
    return text

urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    # Thêm nhiều URL khác
]

corpus = []
for url in urls:
    text = scrape_text_from_url(url)
    corpus.append(text)

# Lưu corpus vào file
with open('corpus.txt', 'w', encoding='utf-8') as f:
    for text in corpus:
        f.write(text + '\n')