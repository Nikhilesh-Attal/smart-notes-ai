// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home">
//       <h1>Smart Notes AI</h1>
//       <p>Upload PDFs, DOCs, or Images and generate AI-powered notes.</p>

//       <div className="home-buttons">
//         <button onClick={() => navigate("/chat")}>Start Chat</button>
//         <button onClick={() => navigate("/login")}>Login</button>
//         <button onClick={() => navigate("/signup")}>Signup</button>
//         <button onClick={() => navigate("/about")}>About Us</button>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Smart Notes AI</h1>
        <p className="home-subtitle">
          Transform your PDFs, DOCs, and Images into structured, 
          AI-powered insights instantly.
        </p>
        
        <div className="home-buttons">
          <button className="btn-primary">Start Chat</button>
          <button className="btn-outline">Login</button>
          <button className="btn-outline">Signup</button>
          <button className="btn-outline">About Us</button>
        </div>
      </div>
    </div>
  );
};

export default Home;