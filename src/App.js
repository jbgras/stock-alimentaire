import './App.css';
import Inventory from './Inventory.js';
import { db } from './data.js';
import { collection, getDocs } from 'firebase/firestore/lite';
import React, { useEffect, useState } from 'react';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      // const articlesCol = collection(db, 'articles');
      // const articlesSnapshot = await getDocs(articlesCol);
      // const articlesList = articlesSnapshot.docs.map(doc => doc.data());
      const articlesList = [{'UMC':'12345'}];
      setArticles(articlesList);
    }
    getArticles();
  }, []);

  return (
    <div className="App">
          table : <Inventory data={articles} />
    </div>
  );
}

export default App;
