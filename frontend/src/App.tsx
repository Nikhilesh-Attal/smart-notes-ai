<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
import Home from "./pages/Home";
import Chat from "./pages/chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
<<<<<<< HEAD
import ProtectedRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Protected Routes - Only logged-in users can visit these */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        {/* Add any other private routes here, like /profile or /settings */}

    </Routes>
=======

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/ContactUs" element={<ContactUs />} />
      </Routes>
      
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
  );
}

export default App;