import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUeauQ3YuPt-yoxg-T2hUQDdfCoXjSHh8",
  authDomain: "gmss-crm.firebaseapp.com",
  projectId: "gmss-crm",
  storageBucket: "gmss-crm.firebasestorage.app",
  messagingSenderId: "706859454556",
  appId: "1:706859454556:web:82cf07bfcfef579600d699"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
