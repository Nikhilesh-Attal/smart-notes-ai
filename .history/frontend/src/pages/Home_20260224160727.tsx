import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    // <div className="home">
    //   <h1 className="home-title">Smart Notes AI</h1>
    //   <p>Upload PDFs, DOCs, or Images and generate AI-powered notes.</p>

    //   <div className="home-buttons">
    //     <button onClick={() => navigate("/chat")}>Start Chat</button>
    //     <button onClick={() => navigate("/login")}>Login</button>
    //     <button onClick={() => navigate("/signup")}>Signup</button>
    //     <button onClick={() => navigate("/about")}>About Us</button>
    //   </div>
    // </div>
    <div id="root">
        <div class="home-container">
            <h1 class="home-title">Smart Notes AI</h1>
            <p class="home-subtitle">Upload PDFs, DOCs, or Images and generate AI-powered notes with ease.</p>
            <div class="home-buttons">
                <button class="home-button" onClick={() => navigate("/chat")}>Start Chat</button>
                <button class="home-button secondary" onClick={() => navigate("/login")}>Login</button>
                <button class="home-button secondary">Signup</button>
                <button class="home-button secondary">About Us</button>
            </div>
        </div>
    </div>
  );
}

export default Home;
