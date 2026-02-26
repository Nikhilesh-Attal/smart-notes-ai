import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { signInUser } = useAuth();

  // --- Logic from your code ---
  const [formData, setFormData] = useState({    
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
      const res = await signInUser({
        email: formData.email,
        password: formData.password,       
      });

      console.log("Login Data:", formData);

      if(res.success){ 
        navigate("/chat"); 
      } else {
        // Note: Make sure this route matches your App.tsx! 
        // If you named it "/signin" in App.tsx, change this to navigate("/signin")
        navigate("/login");
      }
    } catch (err) {
      console.error("Sign in error", err);
      navigate("/login");
    }
  };

  return (
    // --- UI from your teammate's code ---
    <div className="auth-page-wrapper">
      
      <nav className="about-nav">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </nav>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome <span className="welcome-highlight">Back</span></h2>
          <p className="auth-subtitle">Log in to access your smart notes.</p>
          
          {/* We wrap their inputs in your <form> tag to make the logic work */}
          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password" 
              />
            </div>

            <button type="submit" className="auth-submit-btn">Login</button>
          </form>

          {/* Fixed the 'signun' typo here and used your <Link> tag */}
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}