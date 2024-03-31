import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyDDQbjNHCL7TtYLSmbqIZI3a8w19W-xbnk",
    authDomain: "la-boussole-vancouver.firebaseapp.com",
    projectId: "la-boussole-vancouver",
    storageBucket: "la-boussole-vancouver.appspot.com",
    messagingSenderId: "305758368045",
    appId: "1:305758368045:web:a0420abb77215d03d9a3a4",
    measurementId: "G-8CXML2B1VH"
};
  
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
//connectFirestoreEmulator(db, 'localhost', 8080); // emulator
