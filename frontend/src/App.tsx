import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
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
  );
}

export default App;