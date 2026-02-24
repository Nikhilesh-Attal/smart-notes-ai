import { useNavigate } from "react-router-dom";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();

  return (
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
          
          <div className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            <button className="auth-submit-btn">Login</button>
          </div>

          <p className="auth-footer">
            Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;