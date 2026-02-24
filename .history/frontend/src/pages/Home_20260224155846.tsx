import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1 className="home-title">Smart Notes AI</h1>
      <p>Upload PDFs, DOCs, or Images and generate AI-powered notes.</p>

      <div className="home-buttons">
        <button onClick={() => navigate("/chat")}>Start Chat</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={() => navigate("/about")}>About Us</button>
      </div>
    </div>
  );
}

export default Home;
