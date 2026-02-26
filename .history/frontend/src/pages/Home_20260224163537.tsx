// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     // <div className="home">
//     //   <h1 className="home-title">Smart Notes AI</h1>
//     //   <p>Upload PDFs, DOCs, or Images and generate AI-powered notes.</p>

//     //   <div className="home-buttons">
//     //     <button onClick={() => navigate("/chat")}>Start Chat</button>
//     //     <button onClick={() => navigate("/login")}>Login</button>
//     //     <button onClick={() => navigate("/signup")}>Signup</button>
//     //     <button onClick={() => navigate("/about")}>About Us</button>
//     //   </div>
//     // </div>
//     <div id="root">
//         <div class="home-container">
//             <h1 class="home-title">Smart Notes AI</h1>
//             <p class="home-subtitle">Upload PDFs, DOCs, or Images and generate AI-powered notes with ease.</p>
//             <div class="home-buttons">
//                 <button class="home-button" onClick={() => navigate("/chat")}>Start Chat</button>
//                 <button class="home-button secondary" onClick={() => navigate("/login")}>Login</button>
//                 <button class="home-button secondary"onClick={() => navigate("/signup")}>Signup</button>
//                 <button class="home-button secondary" onClick={() => navigate("/about")}>About Us</button>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default Home;

import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-wrapper">
      {/* Header Section */}
      <header className="home-header glass">
        <div className="logo-group">
          <div className="logo-glow-icon"></div>
          <span className="logo-text">Smart Notes <span className="ai-brand">AI</span></span>
        </div>
        
        <div className="header-auth">
          <button onClick={() => navigate("/about")}>About Us</button>
          <button onClick={() => navigate("/ContactUs")}>Features</button>
          <button className="text-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="primary-btn" onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-content glass neon-glow">
          <h1 className="home-title">
            Transforming Thoughts into <br />
            <span className="gradient-highlight">Actionable Knowledge</span>
          </h1>
          <p className="home-subtitle">
            Upload PDFs, DOCs, or Images and generate AI-powered notes with ease.
          </p>
          
          <div className="home-buttons">
            <button className="main-cta" onClick={() => navigate("/chat")}>
              Start Chatting ✨
            </button>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="bento-section">
        <div className="bento-grid">
          <div className="bento-card glass">
            <h3>Auto-Tagging</h3>
            <div className="visual-box tag-dots">
              <span className="dot p"></span><span className="dot g"></span>
            </div>
          </div>
          <div className="bento-card glass">
            <h3>Instant Summary</h3>
            <div className="visual-box bars">
              <div className="bar"></div><div className="bar half"></div>
            </div>
          </div>
          <div className="bento-card glass">
            <h3>Voice-to-Text</h3>
            <div className="visual-box wave"></div>
          </div>
          <div className="bento-card glass">
            <h3>Smart Search</h3>
            <div className="visual-box search-icon">🔍</div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>© 2026 All rights reserved to Smart Notes AI</p>
      </footer>
    </div>
  );
}

export default Home;