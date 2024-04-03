from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from wakepy import keep
import os
import time
import json
import logging

def log(message, level=logging.INFO):
  logger = logging.error if level == logging.ERROR else logging.info
  logger(message)
  print(message)

def extract_data(element, key="time"):
  extract_text = lambda query: element.find_element(By.CSS_SELECTOR, query).text.strip() 
  value = extract_text("h4.tempo" if key == "time" else "div.num")
  kicker = extract_text("label.kicker")
  title = extract_text(".titulo")
  return {
    key: value,
    "kicker": kicker,
    "title": title,
    "image": element.find_element(By.CSS_SELECTOR, "figure > img").get_attribute("src")
  }

def extract_news(base_url):
  options = webdriver.EdgeOptions()
  options.add_argument('--headless')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')
  driver = webdriver.Edge(options=options)
  try:
    news_json = {
      "newest": {},
      "popular": {}
    }
    news_path = os.path.join(root_path, str(datetime.now())[:10] + ".json")
    if os.path.exists(news_path):
      with open(news_path, 'r', encoding='utf-8') as json_file:
        news_json = json.load(json_file)
    driver.get(base_url)
    time.sleep(5)
    log("Gathering latest news.")
    last_news = driver.find_elements(By.CSS_SELECTOR, 'div.minuto-item')
    for article in [extract_data(element) for element in last_news]:
      id = article["time"].replace(":", "") + article["kicker"].replace(" ", "") + article["title"].replace(" ", "")
      news_json["newest"][id] = article
    log("Gathering popular news.")
    popular_news = driver.find_elements(By.CSS_SELECTOR, "section.ml-hc article.box")
    news_json["popular"][str(datetime.now())[11:16]] = [extract_data(element, "num") for element in popular_news]
    with open(news_path, 'w', encoding='utf-8') as json_file:
      json.dump(news_json, json_file)
  except Exception as e:
    log("Error extracting news: " + str(e), logging.ERROR)
  finally:
    driver.quit()


root_path = os.path.join(os.path.expanduser('~'), "Downloads", "data") 
os.mkdir(root_path) if not os.path.exists(root_path) else None
base_url = "https://www.correio24horas.com.br/ultimas"
logging.basicConfig(filename=os.path.join(root_path, 'Mini Proj II - task2.log'),
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')
start_time = datetime.now()
end_time = start_time + timedelta(days=2)
with keep.presenting():
    while datetime.now() < end_time:
        log("Begining a new data extraction.")
        extract_news(base_url)
        log("Extraction finished. Waiting for the next execution.\n")
        time.sleep(3600)