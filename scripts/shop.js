import { db } from './firebase-config.js';
import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const productRef = collection(db, 'products');
const container = document.querySelector('.product-container');

getDocs(productRef).then(snapshot => {
  container.innerHTML = '';
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const id = docSnap.id;

    container.innerHTML += `
      <div class="product">
        <img class="product-img" src="${p.image}" alt="">
        <h2 class="product-name">${p.name}</h2>
        <p class="product-price">Price: GHS ${(p.price / 100).toFixed(2)}</p>
        <input type="number" placeholder="Quantity" class="quantity-input" id="qty_${id}">
        <div class="product-actions">
          <button class="buy-btn" onclick="buyNow('${p.name}', ${p.price}, document.getElementById('qty_${id}').value, '${p.image}')">Buy Now</button>

          <button class="add-to-cart-btn" onclick="addToCart('${p.name}', ${p.price}, document.getElementById('qty_${id}').value, '${p.image}')">Add to Cart</button>
        </div>
      </div>
    `;
  });
});
