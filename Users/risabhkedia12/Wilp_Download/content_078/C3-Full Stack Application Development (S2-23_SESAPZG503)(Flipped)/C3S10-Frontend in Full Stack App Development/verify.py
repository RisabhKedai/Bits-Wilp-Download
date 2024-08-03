import jwt

# Received token
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJpdHMtcGlsYW5pIiwidXNlcklEIjoxMjMsImV4cCI6MTcxNDI5NTcxNH0.BXPIrw1rjUZ6k4SBerarLFnuCn3CpdQKyVVrbWEXWVw"

# Secret key (same as used for generation)
secret = "ssssh"

try:
    decoded = jwt.decode(token, secret, algorithms=['HS256'])
    print(decoded)
except jwt.exceptions.JWTError as e:
    print("Invalid JWT:", e)
