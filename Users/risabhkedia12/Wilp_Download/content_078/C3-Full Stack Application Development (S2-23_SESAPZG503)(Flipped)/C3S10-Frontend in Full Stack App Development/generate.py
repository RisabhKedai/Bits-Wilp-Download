import time
import jwt

# Secret key (replace with your own)
secret = "ssssh"

# Payload
payload = {
    "username": "bits-pilani",
    "userID": 123,
    "exp": int(time.time()) + 60 * 60  # Add expiration time (1 hour)
}

# Generate JWT
token = jwt.encode(payload, secret, algorithm='HS256')

print(token)
