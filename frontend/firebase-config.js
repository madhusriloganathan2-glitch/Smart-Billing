// Firebase Configuration
// Using Firebase v9+ compat libraries (firebase global)

const firebaseConfig = {
    apiKey: "AIzaSyCdI0v1C0WXQZgge_ju7zNBKu3Mu3mTdgU",
    authDomain: "smartrestaurantbilling-f4adb.firebaseapp.com",
    projectId: "smartrestaurantbilling-f4adb",
    storageBucket: "smartrestaurantbilling-f4adb.firebasestorage.app",
    messagingSenderId: "800425147025",
    appId: "1:800425147025:web:3fb1463c5c58cc373add30",
    measurementId: "G-JCHV77XFCC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
console.log("Firebase connected!");
