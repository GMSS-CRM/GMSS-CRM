import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../../app/config/firebase";

export const loginWithEmailPassword = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};
