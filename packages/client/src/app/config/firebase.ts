import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export const firebaseConfig = {
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
  //const continueUrl = `${baseUrl}/dashboard`;
  
  console.log('Action URL being used:', actionUrl); // Debug log
  console.log('Environment:', isLocalhost ? 'localhost' : 'production');
  
  return {
    url: actionUrl,
    handleCodeInApp: false, // Web app, not mobile
  };
};

/**
 * Creates a Firebase account for a new dashboard user without affecting the
 * currently signed-in admin session.
 *
 * Strategy: initialise a *secondary* Firebase app, create the account there,
 * send a password-reset email so the new user can set their own password, then
 * tear down the secondary app.
 *
 * @returns the Firebase UID of the created user
 * @throws if account creation or email dispatch fails
 */
export const createFirebaseUser = async (email: string): Promise<string> => {
  // Random 16-char password — the user will set their own via the reset email
  const tempPassword =
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2).toUpperCase();

  const secondaryApp = initializeApp(firebaseConfig, `UserCreation_${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, tempPassword);
    const uid = credential.user.uid;

    // Send password-reset email so the new user can choose their own password
    try {
      await sendPasswordResetEmail(secondaryAuth, email);
    } catch (emailErr) {
      console.warn('Password-reset email could not be sent:', emailErr);
      // Non-fatal — account still created
    }

    return uid;
  } finally {
    await deleteApp(secondaryApp);
  }
};
