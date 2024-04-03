import "./App.css";
import Inventory from "./Inventory.js";
import React, { useEffect } from "react";
import { signIn } from "./auth.js";

function App() {
  useEffect(() => {
    signIn();
  }, []);
  return <div className="App">{<Inventory />}</div>;
}

export default App;
