import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  // Get user details from metadata
  const userMetadata = session?.user?.user_metadata;
  const fullName = userMetadata?.full_name || "User";
  const email = session?.user?.email;
  const createdAt = new Date(session?.user?.created_at || "").toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=38c16a&color=0b0f1a&size=128`;

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center">
      
      {/* 1. Back Button moved to top-left area below Navbar */}
      <div className="w-full max-w-7xl px-6 py-8 flex justify-start">
        <button 
          onClick={() => navigate(-1)} 
          className="text-brand-green font-bold text-base hover:text-brand-green-hover transition-all flex items-center gap-2 cursor-pointer bg-transparent border-none"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="w-full max-w-2xl bg-brand-glass backdrop-blur-xl border border-brand-border-light rounded-[32px] overflow-hidden shadow-2xl mb-12">
        
        <div className="p-8 sm:p-12">
          {/* 2. Avatar and Logo centered */}
          <div className="flex flex-col items-center justify-center gap-6 mb-10 text-center">
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-32 h-32 rounded-full ring-4 ring-brand-green/20 shadow-xl"
            />
            <div>
              <p className="text-brand-muted text-sm mt-1 uppercase tracking-widest font-bold">User Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-brand-dark/40 p-6 rounded-2xl border border-brand-border-light text-left">
              <div className="grid gap-4">
                <div>
                  <label className="text-[10px] text-brand-green font-black uppercase tracking-[0.2em]">Full Name</label>
                  <p className="text-xl font-semibold">{fullName}</p>
                </div>
                <div className="pt-2 border-t border-brand-border-light/30">
                  <label className="text-[10px] text-brand-green font-black uppercase tracking-[0.2em]">Email Address</label>
                  <p className="text-lg text-brand-muted">{email}</p>
                </div>
                <div className="pt-2 border-t border-brand-border-light/30">
                  <label className="text-[10px] text-brand-green font-black uppercase tracking-[0.2em]">Member Since</label>
                  <p className="text-sm text-brand-muted">{createdAt}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => alert("Coming soon!")}
                className="py-4 bg-brand-green text-brand-dark font-black rounded-xl hover:bg-brand-green-hover transition-all"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => alert("Reset link sent!")}
                className="py-4 bg-transparent border border-brand-green text-brand-green font-black rounded-xl hover:bg-brand-green/5 transition-all"
              >
                Change Password
              </button>
            </div>
            
            <button 
              onClick={() => signOut()}
              className="w-full py-3 text-red-400/70 hover:text-red-400 text-xs font-bold transition-colors uppercase tracking-widest cursor-pointer mt-4"
            >
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}