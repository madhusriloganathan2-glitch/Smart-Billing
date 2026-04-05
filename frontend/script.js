// Firebase is initialized in firebase-config.js
// db is available globally from firebase-config.js

let cart = {};
let total = 0;

function addItem(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = { price: price, qty: 1 };
    }
    renderBill();
}

function changeQty(item, delta) {
    cart[item].qty += delta;
    if (cart[item].qty <= 0) {
        delete cart[item];
    }
    renderBill();
}

function renderBill() {
    const billItems = document.getElementById("billItems");
    billItems.innerHTML = "";
    total = 0;

    for (let item in cart) {
        let itemTotal = cart[item].price * cart[item].qty;
        total += itemTotal;

        billItems.innerHTML += `
            <div class="bill-item">
                <span>${item}</span>
                <div class="qty-control">
                    <button onclick="changeQty('${item}', -1)">−</button>
                    <span>${cart[item].qty}</span>
                    <button onclick="changeQty('${item}', 1)">+</button>
                </div>
                <span>₹${itemTotal}</span>
            </div>
        `;
    }
    document.getElementById("total").innerText = total;
}

function saveOrder() {
    const orderData = {
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    
    // Save to Firebase Firestore directly
    db.collection("orders").add(orderData)
        .then((docRef) => {
            console.log("Order saved to Firebase! ID:", docRef.id);
            alert(`Order saved successfully! ID: ${docRef.id}`);
        })
        .catch((error) => {
            console.error("Firebase save error:", error);
            if (error.code === 'permission-denied') {
                alert("Permission denied! Update Firestore rules:\n1. Go to Firebase Console → Firestore → Rules\n2. Set: allow read, write: if true;\n3. Publish.");
            } else {
                alert(`Save failed: ${error.message}`);
            }
        });
}

function showQR() {
    if (total === 0) {
        alert("Please add items to the bill first!");
        return;
    }
    saveOrder();
    document.getElementById("qrModal").style.display = "flex";
}

function closeQR() {
    document.getElementById("qrModal").style.display = "none";
}

function printBill() {
    if (total === 0) {
        alert("Please add items to the bill first!");
        return;
    }
    saveOrder();
    window.print();
}

function cancelOrder() {
    cart = {};
    total = 0;
    renderBill();
}
