import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1cxvtP7aw_w1QcZ_ytBtIPbzWtlTVhzg",
  authDomain: "my-website-357cb.firebaseapp.com",
  projectId: "my-website-357cb",
  storageBucket: "my-website-357cb.firebasestorage.app",
  messagingSenderId: "759627961944",
  appId: "1:759627961944:web:eb65a9fbd8856fbdab5c2d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
