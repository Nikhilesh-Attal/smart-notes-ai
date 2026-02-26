import { useNavigate, Link } from "react-router-dom";
import { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext"

export default function Login() {

  // Apply email, and password vaildation so our code look more good.

  const navigate = useNavigate();

  const {session, signInUser} = useAuth();
  console.log(session);

  const [formData, setFormData] = useState({    
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TODO: Supabase signup here
      // await supabase.auth.signUp({ email, password })
      const res = await signInUser({
        email: formData.email,
        password: formData.password,       
      });

      console.log("Login Data:", formData);

      if(res.success){ 
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        
        <h2 className="text-3xl font-bold text-center mb-2">
          Have{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Account
          </span>
        </h2>

        <p className="text-center text-sm text-white/80 mb-6">
          Join Smart Notes AI and start transforming your thoughts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 active:scale-[0.98] transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-white/80 mt-6">
          Create an account?{" "}
          <Link
            to="/signun"
            className="text-yellow-300 hover:underline"
          >
            Sing Up
          </Link>
        </p>
      </div>
    </div>
  );
}