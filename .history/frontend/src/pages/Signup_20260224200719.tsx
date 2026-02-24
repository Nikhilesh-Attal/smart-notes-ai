import { useNavigate } from "react-router-dom";
import "../pages/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  return (
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
          
          <div className="auth-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" required />
            </div>

            <button className="auth-submit-btn">Sign Up</button>
          </div>

          <p className="auth-footer">
            Already have an account? <span onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;