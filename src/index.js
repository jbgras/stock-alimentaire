import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDQbjNHCL7TtYLSmbqIZI3a8w19W-xbnk",
  authDomain: "la-boussole-vancouver.firebaseapp.com",
  projectId: "la-boussole-vancouver",
  storageBucket: "la-boussole-vancouver.appspot.com",
  messagingSenderId: "305758368045",
  appId: "1:305758368045:web:a0420abb77215d03d9a3a4",
  measurementId: "G-8CXML2B1VH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// emulator
//connectFirestoreEmulator(db, 'localhost', 8080);
// firebase emulators:start
// firebase deploy --only hosting:la-boussole-vancouver

// live
// https://la-boussole-vancouver.web.app/

// todo
// display instead of console ?
// editable Data Table Component
// firebase experiments:enable webframeworks
// gitops / github pull request
//    - deploy yaml https://stackoverflow.com/questions/74426925/how-can-run-firebase-experimentsenable-webframeworks-with-github-actions
//    - github action https://firebase.google.com/docs/hosting/github-integration
//    - https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-firebase/
//    - https://firebase.google.com/docs/hosting/quickstart?hl=en&authuser=0
// auth : https://firebase.google.com/docs/web/setup

// Get a list of articles from your database
async function getArticles(db) {
  const articlesCol = collection(db, 'articles');
  const articlesSnapshot = await getDocs(articlesCol);
  const articlesList = articlesSnapshot.docs.map(doc => doc.data());
  return articlesList;
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const articlesList = await getArticles(db)
console.log("articles:"+JSON.stringify(articlesList))
root.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
