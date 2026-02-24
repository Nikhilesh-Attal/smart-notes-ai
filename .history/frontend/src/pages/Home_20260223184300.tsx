import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Home;