import "./App.css";
import Inventory from "./Inventory.js";
import React, { useEffect } from "react";
import { signIn } from "./auth.js";

function App() {
  useEffect(() => {
    // signIn();
  }, []);

  function header() {
    return (
      <header>
        <div>
          <img
            decoding="async"
            width="5%"
            height="5%"
            src="Logo-LBV-Tagline-White.png"
            style={{ textAlign: "left" }}
          />
          <h3>Stock alimentaire</h3>
        </div>
      </header>
    );
  }

  return (
    <div className="App">
      {header()}
      {<Inventory />}
    </div>
  );
}

export default App;
