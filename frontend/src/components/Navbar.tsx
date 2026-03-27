import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const {session, signOut} = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  //extract name for the avatar, default to "User" of missing
  const fullName = session?.user?.user_metadata?.full_name || "User";

  //generate avatar image using the user's initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff`;

  return (
    <nav className="bg-gray-900 border-b border-gray-700 w-full">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left */}
          <div className="flex items-center gap-8">
            <div className="text-white font-semibold text-lg">
              <img src="/AI_smart_Notes_logo.png" alt="Smart Notes AI Logo" className="h-8 w-8" />
              <span>Smart Notes.AI</span>
            </div>

            <div className="hidden sm:flex gap-4">
              <Link to="/" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                Home
              </Link>
              
              {/* Conditional link based on Auth */}
              { session ? (
                <Link to = "/chat" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                  Signup
                </Link>
              )}
            </div>
          </div>

          {/* Right profile : Profile dropdown show only if user logged in */}
          { session && (
            <div className="relative flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden sm:block">Welcome, {fullName}</span>  
              <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none">
                <img
                  src={avatarUrl} alt="User Avatar"
                  className="h-8 w-8 rounded-full border border-gray-600"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="/signout" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          )}

          { /* if not logged in, show a simple login button instead of avatar*/}
          {!session && (
            <Link to="\login" className="px-2 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}