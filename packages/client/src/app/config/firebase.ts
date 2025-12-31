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

/**
 * Dynamic Action Code Settings for Firebase Email Actions
 * 
 * Generates appropriate URLs for both development (localhost) and production (Render)
 * This ensures email links work correctly in both environments
 */
export const getActionCodeSettings = () => {
  // Detect environment based on hostname
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  // Set base URL based on environment
  const baseUrl = isLocalhost 
    ? 'http://localhost:5173' 
    : 'https://gmss-crm.onrender.com';
  
  // The action handler path (must match your route in AppRoutes)
  const actionUrl = `${baseUrl}/auth/action`;
  
  // Where to redirect after successful action (optional)
  const continueUrl = `${baseUrl}/dashboard`;
  
  console.log('Action URL being used:', actionUrl); // Debug log
  console.log('Environment:', isLocalhost ? 'localhost' : 'production');
  
  return {
    url: actionUrl,
    handleCodeInApp: false, // Web app, not mobile
  };
};
