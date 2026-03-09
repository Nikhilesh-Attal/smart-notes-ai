import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <App />
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);