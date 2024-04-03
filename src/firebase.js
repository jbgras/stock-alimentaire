import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDQbjNHCL7TtYLSmbqIZI3a8w19W-xbnk",
  authDomain: "la-boussole-vancouver.firebaseapp.com",
  projectId: "la-boussole-vancouver",
  storageBucket: "la-boussole-vancouver.appspot.com",
  messagingSenderId: "305758368045",
  appId: "1:305758368045:web:a0420abb77215d03d9a3a4",
  measurementId: "G-8CXML2B1VH",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
