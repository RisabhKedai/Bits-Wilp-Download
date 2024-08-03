import requests

webhook_url = 'http://127.0.0.1:5000/webhook'
data = {"key": "value"}  # Your webhook data

response = requests.post(webhook_url, json=data)
print(response.json())
