// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtASqw5yCt4YjEjzlpPph7pShNMH4DXpk",
  authDomain: "store-cbcfe.firebaseapp.com",
  projectId: "store-cbcfe",
  storageBucket: "store-cbcfe.firebasestorage.app",
  messagingSenderId: "471766035205",
  appId: "1:471766035205:web:6fc84482f2c500ee50e56c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);  // <-- Add this

export { db, storage };  // <-- Export storage too
