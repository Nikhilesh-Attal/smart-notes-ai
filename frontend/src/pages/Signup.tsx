import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signUpNewUser } = useAuth();

  // --- Logic from your code ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signUpNewUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      console.log("Signup Data:", formData);

      if (res.success) { 
        navigate("/chat"); 
      } else {
        navigate("/signup");
      }
    } catch (err) {
      console.error("Signup error", err);
      navigate("/signin");
    }
  };

  return (
    // --- UI from your teammate's code ---
    <div className="auth-page-wrapper">
      
      {/* Navigation Back */}
      <nav className="about-nav">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </nav>

      <div className="auth-container">
        <div className="auth-box glass">
          <h2>Create <span className="gradient-highlight">Account</span></h2>
          <p className="auth-subtitle">Join Smart Notes AI and start transforming your thoughts.</p>
          
          {/* Wrapped inputs in your form logic */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                id="fullName"
                name="fullName"
                type="text" 
                required 
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name" 
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                required 
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password" 
              />
            </div>

            <button type="submit" className="auth-submit-btn">Sign Up</button>
          </form>

          {/* Fixed routing to point to /signin */}
          <p className="auth-footer">
            Already have an account? <Link to="/signin">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}