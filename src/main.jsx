import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreContextProvider>
    <Router>
      <App />
    </Router>
    </StoreContextProvider>
  </React.StrictMode>
);
