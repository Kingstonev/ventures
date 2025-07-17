import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// === Cloudinary Config ===
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/drwqabhyx/image/upload';
const CLOUDINARY_PRESET = 'GENERAL'; // ✅ this matches your actual preset name

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imageFileInput = document.getElementById('imageFile');
const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');







document.addEventListener('DOMContentLoaded', () => {
  const adminId = document.getElementById('adminId');
  const adminPassword = document.getElementById('adminPassword');
  const loginBtn = document.getElementById('loginBtn');
  const adminSection = document.getElementById('admin');

  let isLoggedIn = false;

  loginBtn.onclick = () => {
    if (!isLoggedIn) {
      const id = adminId.value.trim();
      const password = adminPassword.value;

      if (id === "2150" && password === "123") {
        isLoggedIn = true;
        adminSection.style.display = "block";
        loginBtn.textContent = " Logout";
        alert("✅ Logged in successfully!");
      } else {
        alert("❌ Invalid credentials.");
      }
    } else {
      isLoggedIn = false;
      adminSection.style.display = "none";
      loginBtn.textContent = "🔐 Login";
      adminId.value = '';
      adminPassword.value = '';
      alert("👋 Logged out.");
    }
  };
});






const productRef = collection(db, 'products');

// === Upload to Cloudinary ===
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file); // actual image file
  formData.append('upload_preset', 'GENERAL'); // ✅ MATCHES your preset

  const res = await fetch('https://api.cloudinary.com/v1_1/drwqabhyx/image/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  console.log('Cloudinary response:', data);

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Image upload failed');
  }

  return data.secure_url;
}


// === Add Product ===
addProductBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value.trim());
  const file = imageFileInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert('Please enter name, price, and choose an image.');
    return;
  }

  try {
    const imageUrl = await uploadImageToCloudinary(file);

    await addDoc(productRef, {
      name,
      price: Math.round(price * 100),
      image: imageUrl
    });

    alert('✅ Product added!');
    nameInput.value = '';
    priceInput.value = '';
    imageFileInput.value = '';
    loadProducts();
  } catch (err) {
    console.error('Error adding product:', err);
    alert('❌ Failed to add product: ' + err.message);
  }
};

// === Edit Product ===
window.editProduct = async (id, oldData) => {
  const newName = prompt('New name:', oldData.name);
  const newPrice = prompt('New price:', (oldData.price / 100).toFixed(2));
  const file = imageFileInput.files[0];

  const updateData = {
    name: newName || oldData.name,
    price: Math.round(parseFloat(newPrice || oldData.price / 100) * 100)
  };

  if (file) {
    const newImageUrl = await uploadImageToCloudinary(file);
    updateData.image = newImageUrl;
  }

  await updateDoc(doc(db, 'products', id), updateData);
  alert('✅ Product updated');
  loadProducts();
};

// === Delete Product ===
window.deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await deleteDoc(doc(db, 'products', id));
    loadProducts();
  }
};

// === Load Products ===
async function loadProducts() {
  const snapshot = await getDocs(productRef);
  productList.innerHTML = '';

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${data.image}" alt="${data.name}" />
      <h3>${data.name}</h3>
      <p>GHS ${(data.price / 100).toFixed(2)}</p>
      <button onclick="editProduct('${id}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">✏️ Edit</button>
      <button onclick="deleteProduct('${id}')">🗑️ Delete</button>
    `;
    productList.appendChild(div);
  });
}

loadProducts();
