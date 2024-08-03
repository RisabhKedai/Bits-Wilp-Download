from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json  # Assuming the data sent is in JSON format
    # Process the webhook data here
    print("Webhook received:", data)
    return jsonify({"message": "Webhook received successfully"})

if __name__ == '__main__':
    app.run(debug=True)