import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left */}
          <div className="flex items-center gap-8">
            <div className="text-white font-semibold text-lg">
              AI Chat
            </div>

            <div className="hidden sm:flex gap-4">
              <Link to="/" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                Home
              </Link>
              <Link to="/team" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                Team
              </Link>
              <Link to="/signup" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                Signup
              </Link>
              <Link to="/calendar" className="px-3 py-2 text-sm text-gray-300 hover:text-white">
                Calendar
              </Link>
            </div>
          </div>

          {/* Right profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&q=80"
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
        </div>
      </div>
    </nav>
  );
}