import { useNavigate } from "react-router-dom";
// 1. Import the logo from its actual location
import logo from "./AI_smart_Notes_Logo.png"; 
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-wrapper">

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
        <h2 className="section-label">Features</h2>
        <div className="bento-grid">
          <div className="bento-card glass">
            <div className="visual-box">
               <span className="dot p"></span><span className="dot g"></span>
            </div>
            <h3>Auto-Tagging</h3>
          </div>
          <div className="bento-card glass">
            <div className="visual-box">
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </div>
            <h3>Instant Summary</h3>
          </div>
          <div className="bento-card glass">
            <div className="visual-box">
              <div className="waveform"></div>
            </div>
            <h3>Voice-to-Text</h3>
          </div>
          <div className="bento-card glass">
            <div className="visual-box">
              <span className="search-icon">🔍</span>
            </div>
            <h3>Smart Search</h3>
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