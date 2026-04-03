import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const fullName = session?.user?.user_metadata?.full_name || "User";

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=38c16a&color=0b0f1a`;

  // Shared button style for both Login and Signup to ensure they look identical
  const authButtonStyle = "px-6 py-2 text-sm bg-brand-green hover:bg-brand-green-hover text-brand-dark font-bold rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-brand-green/10 whitespace-nowrap";

  return (
    <nav className="bg-brand-dark border-b border-brand-border w-full sticky top-0 z-[100]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-semibold flex-shrink-0"
          >
            <img src="/AI_smart_Notes_logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-sm sm:text-lg whitespace-nowrap">
              Smart Notes<span className="text-brand-green">.AI</span>
            </span>
          </Link>

          {/* Navigation & Auth Wrapper */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center gap-2 lg:gap-6 mr-2">
              <Link className="px-3 py-2 text-sm text-brand-muted hover:text-white rounded-lg hover:bg-brand-glass-hover transition-all duration-200" to="/">
                Home
              </Link>
              {session && (
                <Link className="px-3 py-2 text-sm text-brand-muted hover:text-white rounded-lg hover:bg-brand-glass-hover transition-all duration-200" to="/chat">
                  Dashboard
                </Link>
              )}
              <Link className="px-3 py-2 text-sm text-brand-muted hover:text-white rounded-lg hover:bg-brand-glass-hover transition-all duration-200" to="/about">
                About Us
              </Link>
              <Link className="px-3 py-2 text-sm text-brand-muted hover:text-white rounded-lg hover:bg-brand-glass-hover transition-all duration-200" to="/contact">
                Contact Us
              </Link>
            </div>

            {/* AUTH SECTION */}
            <div className="flex items-center gap-3">
              {session ? (
                /* Profile Dropdown (Logged In) */
                <div className="relative flex items-center">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <img
                      src={avatarUrl}
                      alt="User"
                      className="h-9 w-9 rounded-full ring-2 ring-brand-green/30 hover:ring-brand-green/60 transition-all duration-200"
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-brand-dark rounded-xl shadow-xl border border-brand-border-light overflow-hidden z-50">
                      <Link 
                        className="block px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-brand-glass-hover" 
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-brand-glass-hover transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Identical Login/Signup Buttons (Logged Out) */
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Subtle vertical separator */}
                  <div className="hidden lg:block h-6 w-[1px] bg-brand-border mx-1"></div>
                  
                  <Link to="/login" className={authButtonStyle}>
                    Log In
                  </Link>
                  
                  <Link to="/signup" className={authButtonStyle}>
                    Sign Up
                  </Link>
                </div>
              )}

              {/* MOBILE HAMBURGER BUTTON */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5 bg-brand-glass-hover rounded-lg transition-all"
              >
                <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-border px-6 py-6 space-y-4 shadow-2xl">
          <Link onClick={() => setMenuOpen(false)} to="/" className="block text-brand-muted hover:text-white py-2">
            Home
          </Link>
          {session && (
            <Link onClick={() => setMenuOpen(false)} to="/chat" className="block text-brand-muted hover:text-white py-2">
              Dashboard
            </Link>
          )}
          <Link onClick={() => setMenuOpen(false)} to="/about" className="block text-brand-muted hover:text-white py-2">
            About Us
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/contact" className="block text-brand-muted hover:text-white py-2">
            Contact Us
          </Link>

          {/* Mobile Auth Actions */}
          {!session ? (
            <div className="pt-4 border-t border-brand-border flex flex-col gap-3">
              <Link onClick={() => setMenuOpen(false)} to="/login" className="text-center py-3 text-brand-green border border-brand-green rounded-full font-bold">
                Log In
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/signup" className="text-center py-3 bg-brand-green text-brand-dark rounded-full font-bold">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-brand-border space-y-4">
              <div className="flex items-center gap-3 px-2">
                <img src={avatarUrl} alt="User" className="h-10 w-10 rounded-full" />
                <span className="text-white font-medium">{fullName}</span>
              </div>
              <button onClick={handleSignOut} className="w-full py-3 text-red-400 bg-red-400/10 rounded-xl text-sm font-bold">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}