# Firebase Setup Guide

## Fix Firestore Permission Error

The orders are not saving because Firestore requires authentication by default. Follow these steps to fix:

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **smartrestaurantbilling-f4adb**
3. Go to **Firestore Database**

### Step 2: Update Security Rules
1. Click the **Rules** tab
2. Replace all content with:

```
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

### Step 3: Test Again
Now try adding items and clicking "Pay via QR" or "Print/Download" in your app.

---

## Current Status
- ✅ Frontend is connected to Firebase config
- ✅ Backend API is working (saves orders locally)
- ⚠️ Firebase Firestore needs security rules updated (see above)
- ✅ Orders are saved in backend memory as backup
