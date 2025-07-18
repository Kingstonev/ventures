let cart = [];
const imageBaseURL = "https://francis2150.github.io/Gabbys-Projects-/";

// Add to cart function
function addToCart(name, price, quantity, imageUrl) {
  if (!quantity || quantity <= 0) {
    quantity = 1;
  }

  const existingIndex = cart.findIndex(item => item.name === name && item.image === imageUrl);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += parseInt(quantity);
  } else {
    cart.push({
      name,
      price,
      quantity: parseInt(quantity),
      image: imageUrl
    });
  }

  renderCart();
}

// Render cart items
function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalDiv = document.getElementById("cart-total");
  cartItemsDiv.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const itemHTML = `
      <div class="cart-item">
        <img src="${imageBaseURL + item.image}" width="40" height="40" style="vertical-align:middle; border-radius:4px; margin-right:8px;" />
        <span>${item.name}</span> - GHS ${(item.price / 100).toFixed(2)} × ${item.quantity} = <strong>GHS ${(subtotal / 100).toFixed(2)}</strong>
        <button onclick="removeFromCart(${index})" style="color:red; float:right;">Remove</button>
      </div>
    `;
    cartItemsDiv.innerHTML += itemHTML;
  });

  cartTotalDiv.innerText = `Total: GHS ${(total / 100).toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Show order form when clicking "Order Now"
document.getElementById("orderBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("order-form").style.display = "block";
});

// Submit order via WhatsApp
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const phone = document.getElementById("customerWhatsApp").value;

  let message = `🛒 *New Order*%0A-------------------%0A`;

  cart.forEach(item => {
    const fullImageUrl = item.image.startsWith("http")
      ? item.image
      : imageBaseURL + item.image;

    message += `• ${item.name} - GHS ${(item.price / 100).toFixed(2)} × ${item.quantity}%0A📷 Image: ${fullImageUrl}%0A%0A`;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `-------------------%0A🧾 *Total:* GHS ${(total / 100).toFixed(2)}%0A%0A`;
  message += `👤 *Customer Info*:%0AName: ${name}%0AEmail: ${email}%0AWhatsApp: ${phone}`;

  const whatsappNumber = "233508640097"; // Replace with your actual number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, "_blank");
});


window.buyNow = function(name, price, quantity, imageUrl) {
  if (!quantity || quantity <= 0) {
    quantity = 1;
  }

  // Clear cart and add only the selected product
  cart = [];
  addToCart(name, price, quantity, imageUrl);
  document.getElementById("order-form").style.display = "block";
};
