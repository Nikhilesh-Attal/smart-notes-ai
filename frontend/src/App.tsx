import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Added Navigate
import { useAuth } from "./context/AuthContext"; // Import useAuth to get session
import Home from "./pages/Home";
import Chat from "./pages/chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const { user } = useAuth(); // Get auth state

  // Hide footer on chat page
  const hideFooter = location.pathname.startsWith("/chat");

  // Prevent flicker by showing a loader while checking auth
  if (user) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected Routes - Moving Profile inside here handles the session check for you */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all: Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;