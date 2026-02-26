import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
<<<<<<< HEAD
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
=======
import "./pages/layout.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
  </React.StrictMode>
);