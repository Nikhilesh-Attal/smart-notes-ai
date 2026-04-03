import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signInUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 1. State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signInUser({
        email: formData.email,
        password: formData.password,
      });
      if (res.success) {
        navigate("/chat");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Sign in error", err);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col overflow-x-hidden">
      <nav className="w-full px-12 py-8 flex justify-start">
        <button
          className="text-brand-green font-semibold text-base cursor-pointer hover:opacity-80 hover:-translate-x-1 transition-all duration-300 bg-transparent border-none"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-[450px] px-10 py-12 rounded-[40px] text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <h2 className="text-4xl font-extrabold text-white mb-2.5">
            Welcome <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">Back</span>
          </h2>
          <p className="text-brand-muted mb-9 text-base">Log in to access your smart notes.</p>

          <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-slate-300 text-sm font-semibold ml-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-brand-glass-hover border border-brand-border-light rounded-xl px-5 py-3.5 text-white text-base outline-none focus:border-brand-green focus:bg-brand-glass-focus transition-all duration-300 w-full placeholder-brand-subtle"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-slate-300 text-sm font-semibold ml-1">Password</label>
              
              {/* 2. Wrap input in a relative container */}
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  // 3. Dynamic type based on state
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-brand-glass-hover border border-brand-border-light rounded-xl px-5 py-3.5 pr-12 text-white text-base outline-none focus:border-brand-green focus:bg-brand-glass-focus transition-all duration-300 w-full placeholder-brand-subtle"
                />
                
                {/* 4. The Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-green transition-colors duration-200 bg-transparent border-none p-1 cursor-pointer"
                  tabIndex={-1} // Prevents tabbing to the eye icon instead of the login button
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2.5} />
                  ) : (
                    <Eye size={20} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-brand-green text-brand-dark border-none py-4 rounded-full font-extrabold text-lg cursor-pointer shadow-[0_10px_15px_-3px_rgba(56,193,106,0.3)] hover:bg-brand-green-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-8 text-brand-muted text-sm">
            Don't have an account? <Link to="/signup" className="text-brand-green font-bold hover:text-brand-green-light transition-colors duration-200">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}