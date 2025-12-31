import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaLz2fpoBti1wvz9ZGILRHXCSZQFbVSEU",
  authDomain: "gmss--crm.firebaseapp.com",
  projectId: "gmss--crm",
  storageBucket: "gmss--crm.firebasestorage.app",
  messagingSenderId: "623508668140",
  appId: "1:623508668140:web:5a9e102f7d5de050d6efc9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Action Code Settings for password reset
export const getActionCodeSettings = () => {
  // Get the current origin or use environment variable for production
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const url = `${baseUrl}/__/auth/action`;
  
  console.log('Action URL being used:', url); // Debug log
  
  return {
    url,
    handleCodeInApp: true,
  };
};
