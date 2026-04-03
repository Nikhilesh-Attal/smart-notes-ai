import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Icons for the toggle
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { signUpNewUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // 1. State for password visibility
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
      const res = await signUpNewUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (res.success) {
        navigate("/chat");
      } else {
        navigate("/signup");
      }
    } catch (err) {
      console.error("Signup error", err);
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex justify-start">
        <button
          className="text-brand-green font-semibold text-sm sm:text-base cursor-pointer hover:opacity-80 hover:-translate-x-1 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl 
          px-5 sm:px-8 md:px-10 
          py-8 sm:py-10 md:py-12 
          rounded-2xl sm:rounded-3xl md:rounded-[40px] 
          text-center bg-brand-glass backdrop-blur-xl 
          border border-brand-border-light 
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
        >
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
            Create{" "}
            <span className="bg-linear-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
              Account
            </span>
          </h2>

          <p className="text-brand-muted mb-6 sm:mb-8 text-sm sm:text-base">
            Join Smart Notes AI and start transforming your thoughts.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4 sm:gap-5 text-left" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="bg-brand-glass-hover border border-brand-border-light 
                rounded-lg sm:rounded-xl 
                px-4 sm:px-5 py-3 
                text-sm sm:text-base text-white 
                focus:border-brand-green focus:bg-brand-glass-focus 
                transition-all duration-300 w-full placeholder-brand-subtle"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-brand-glass-hover border border-brand-border-light 
                rounded-lg sm:rounded-xl 
                px-4 sm:px-5 py-3 
                text-sm sm:text-base text-white 
                focus:border-brand-green focus:bg-brand-glass-focus 
                transition-all duration-300 w-full placeholder-brand-subtle"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
                Password
              </label>
              {/* Added relative wrapper */}
              <div className="relative">
                <input
                  name="password"
                  // 2. Dynamic type toggle
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="bg-brand-glass-hover border border-brand-border-light 
                  rounded-lg sm:rounded-xl 
                  px-4 sm:px-5 py-3 pr-12
                  text-sm sm:text-base text-white 
                  focus:border-brand-green focus:bg-brand-glass-focus 
                  transition-all duration-300 w-full placeholder-brand-subtle"
                />
                {/* 3. Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-green transition-colors duration-200 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-3 sm:mt-4 
              bg-brand-green text-brand-dark 
              py-3 sm:py-4 
              rounded-full font-bold sm:font-extrabold 
              text-base sm:text-lg 
              hover:bg-brand-green-hover hover:-translate-y-0.5 
              transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-8 text-brand-muted text-xs sm:text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-brand-green font-bold hover:text-brand-green-light transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}








// import { useState, type FormEvent, type ChangeEvent } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Signup() {
//   const navigate = useNavigate();
//   const { signUpNewUser } = useAuth();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const res = await signUpNewUser({
//         email: formData.email,
//         password: formData.password,
//         fullName: formData.fullName,
//       });

//       console.log("Signup Data:", formData);

//       if (res.success) {
//         navigate("/chat");
//       } else {
//         navigate("/signup");
//       }
//     } catch (err) {
//       console.error("Signup error", err);
//       navigate("/signin");
//     }
//   };

//   return (
//   <div className="min-h-screen bg-brand-dark flex flex-col overflow-x-hidden">

//     {/* Navigation */}
//     <nav className="w-full px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex justify-start">
//       <button
//         className="text-brand-green font-semibold text-sm sm:text-base cursor-pointer hover:opacity-80 hover:-translate-x-1 transition-all duration-300"
//         onClick={() => navigate('/')}
//       >
//         ← Back to Home
//       </button>
//     </nav>

//     {/* Main Container */}
//     <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
      
//       <div className="w-full max-w-md sm:max-w-lg md:max-w-xl 
//         px-5 sm:px-8 md:px-10 
//         py-8 sm:py-10 md:py-12 
//         rounded-2xl sm:rounded-3xl md:rounded-[40px] 
//         text-center bg-brand-glass backdrop-blur-xl 
//         border border-brand-border-light 
//         shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
//       >

//         {/* Heading */}
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
//           Create{" "}
//           <span className="bg-linear-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
//             Account
//           </span>
//         </h2>

//         <p className="text-brand-muted mb-6 sm:mb-8 text-sm sm:text-base">
//           Join Smart Notes AI and start transforming your thoughts.
//         </p>

//         {/* Form */}
//         <form className="flex flex-col gap-4 sm:gap-5 text-left" onSubmit={handleSubmit}>
          
//           {/* Full Name */}
//           <div className="flex flex-col gap-1.5 sm:gap-2">
//             <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
//               Full Name
//             </label>
//             <input
//               name="fullName"
//               type="text"
//               required
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Enter your name"
//               className="bg-brand-glass-hover border border-brand-border-light 
//               rounded-lg sm:rounded-xl 
//               px-4 sm:px-5 py-3 
//               text-sm sm:text-base text-white 
//               focus:border-brand-green focus:bg-brand-glass-focus 
//               transition-all duration-300 w-full placeholder-brand-subtle"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex flex-col gap-1.5 sm:gap-2">
//             <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
//               Email
//             </label>
//             <input
//               name="email"
//               type="email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="bg-brand-glass-hover border border-brand-border-light 
//               rounded-lg sm:rounded-xl 
//               px-4 sm:px-5 py-3 
//               text-sm sm:text-base text-white 
//               focus:border-brand-green focus:bg-brand-glass-focus 
//               transition-all duration-300 w-full placeholder-brand-subtle"
//             />
//           </div>

//           {/* Password */}
//           <div className="flex flex-col gap-1.5 sm:gap-2">
//             <label className="text-slate-300 text-xs sm:text-sm font-semibold ml-1">
//               Password
//             </label>
//             <input
//               name="password"
//               type="password"
//               required
//               minLength={6}
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Create a password"
//               className="bg-brand-glass-hover border border-brand-border-light 
//               rounded-lg sm:rounded-xl 
//               px-4 sm:px-5 py-3 
//               text-sm sm:text-base text-white 
//               focus:border-brand-green focus:bg-brand-glass-focus 
//               transition-all duration-300 w-full placeholder-brand-subtle"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="mt-3 sm:mt-4 
//             bg-brand-green text-brand-dark 
//             py-3 sm:py-4 
//             rounded-full font-bold sm:font-extrabold 
//             text-base sm:text-lg 
//             hover:bg-brand-green-hover hover:-translate-y-0.5 
//             transition-all duration-300"
//           >
//             Sign Up
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 sm:mt-8 text-brand-muted text-xs sm:text-sm">
//           Already have an account?{" "}
//           <Link
//             to="/signin"
//             className="text-brand-green font-bold hover:text-brand-green-light transition-colors duration-200"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   </div>
// );
// }