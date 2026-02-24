import "../pages/auth.css";

const Login = () => {
  return (
    {/* Navigation Back */}
            <nav className="about-nav">
                <button className="back-link" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </nav>
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
};

export default Login;