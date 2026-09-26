import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeWJC_qX67Rw4Oy7tmkaGDjWnruKMYD0I",
  authDomain: "mehreen-portfolio.firebaseapp.com",
  projectId: "mehreen-portfolio",
  storageBucket: "mehreen-portfolio.firebasestorage.app",
  messagingSenderId: "448211738227",
  appId: "1:448211738227:web:cdd79511fa26db0f9e5406",
  measurementId: "G-RHFPQZYQK6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);