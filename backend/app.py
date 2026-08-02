from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

# Firebase Configuration - Using REST API
# TODO: Replace with your actual Firebase config
FIREBASE_PROJECT_ID = "smartrestaurantbilling-f4adb"
FIREBASE_API_KEY = "AIzaSyCdI0v1C0WXQZgge_ju7zNBKu3Mu3mTdgU"

# In-memory storage (fallback)
orders_storage = []

def save_to_firebase_rest(items, total):
    """Save order to Firebase Firestore using REST API"""
    try:
        # Get Firebase ID token for anonymous auth
        # For simplicity, we'll use the Firestore REST API directly
        
        order_data = {
            "fields": {
                "items": {"stringValue": str(items)},
                "total": {"integerValue": str(total)},
                "date": {"stringValue": datetime.now().strftime("%Y-%m-%d")},
                "timestamp": {"stringValue": datetime.now().isoformat()}
            }
        }
        
        # Create document in Firestore
        url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/orders"
        
        response = requests.post(url, json=order_data)
        
        if response.status_code in [200, 201]:
            print("Order saved to Firebase via REST API!")
            return True
        else:
            print(f"Firebase REST error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Firebase error: {e}")
        return False

@app.route("/")
def home():
    return "Smart Restaurant Billing Running"

@app.route("/add-order", methods=["POST"])
def add_order():
    data = request.json
    now = datetime.now()
    
    order = {
        "items": data.get("items", {}),
        "total": data.get("total", 0),
        "date": now.strftime("%Y-%m-%d"),
        "month": now.strftime("%Y-%m"),
        "timestamp": now.isoformat()
    }
    
    # Try to save to Firebase
    firebase_success = save_to_firebase_rest(order["items"], order["total"])
    
    # Always save to local storage too (backup)
    order["id"] = len(orders_storage) + 1
    orders_storage.append(order)
    
    if firebase_success:
        return jsonify({"message": "Order saved to Firebase!"}), 201
    else:
        return jsonify({"message": "Order saved locally (Firebase unavailable)"}), 201

@app.route("/daily-sales/<date>", methods=["GET"])
def daily_sales(date):
    total = sum(o["total"] for o in orders_storage if o["date"] == date)
    return jsonify({"date": date, "total_sales": total})

@app.route("/monthly-sales/<month>", methods=["GET"])
def monthly_sales(month):
    total = sum(o["total"] for o in orders_storage if o["month"] == month)
    return jsonify({"month": month, "total_sales": total})

if __name__ == "__main__":
    app.run(debug=True)
