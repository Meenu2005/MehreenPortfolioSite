import {
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, googleProvider } from "./config";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;

    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};