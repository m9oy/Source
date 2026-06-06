import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBL6Ryu1c-iUhlNAiBzufWOepsj1oWjMJs",
  authDomain: "desvcraft.firebaseapp.com",
  databaseURL: "https://desvcraft-default-rtdb.firebaseio.com",
  projectId: "desvcraft",
  storageBucket: "desvcraft.firebasestorage.app",
  messagingSenderId: "488609817409",
  appId: "1:488609817409:web:b9eda3668eb3f2ba3077c0",
  measurementId: "G-1HGP7MN78M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
