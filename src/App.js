import './App.css'
import Table from './Table.js'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore/lite';
import React, { useState }  from 'react';

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
//connectFirestoreEmulator(db, 'localhost', 8080); // emulator

// Get a list of articles from your database
async function GetArticles() {
  // const [articles, setArticles] = useState()
  const [articles, setArticles] = useState();

  const articlesCol = collection(db, 'articles');
  const articlesSnapshot = await getDocs(articlesCol);
  const articlesList = articlesSnapshot.docs.map(doc => doc.data());
  // // .then((articlesSnapshot) => {
  // //     articles = articlesSnapshot.docs.map(doc => doc.data())
  // // })
  // // .catch ((error) => console.log(error) )
  setArticles(articlesList);
  console.log("articles:"+JSON.stringify(articles))
}

function App() {
  GetArticles()
  return (
    <div className="App">
          table : <Table/>
    </div>
);
}

export default App;
