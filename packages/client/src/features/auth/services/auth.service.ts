import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth, getActionCodeSettings } from "../../../app/config/firebase";

export const loginWithEmailPassword = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  const actionCodeSettings = getActionCodeSettings();
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
};

export const verifyResetCode = (code: string) => {
  return verifyPasswordResetCode(auth, code);
};

export const confirmNewPassword = (code: string, newPassword: string) => {
  return confirmPasswordReset(auth, code, newPassword);
};
