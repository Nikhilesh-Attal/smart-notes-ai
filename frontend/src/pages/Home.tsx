import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center text-brand-text font-sans selection:bg-purple-500/30">
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-5 py-24 w-full">
        <div className="text-center px-10 py-20 rounded-[40px] max-w-[1000px] bg-brand-glass backdrop-blur-xl border border-brand-border-light shadow-[0_0_80px_rgba(168,85,247,0.15)] relative overflow-hidden">
          {/* Subtle background glow decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/10 blur-[100px] rounded-full"></div>

          <h1 className="relative z-10 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1] mb-6 text-white">
            Transforming Thoughts into <br />
            <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
              Actionable Knowledge
            </span>
          </h1>
          <p className="relative z-10 text-xl text-brand-muted mb-12 max-w-[700px] mx-auto leading-relaxed">
            Stop scrolling through endless pages. Upload PDFs, DOCs, or Images and let AI extract the insights you actually need.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              className="px-12 py-5 text-lg font-bold border-none rounded-full bg-brand-green text-brand-dark cursor-pointer shadow-[0_10px_30px_rgba(74,222,128,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={() => navigate("/chat")}
            >
              Start Chatting ✨
            </button>
            <button className="px-12 py-5 text-lg font-bold rounded-full border border-brand-border-light text-white hover:bg-white/5 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-border-light/50">
            <p className="text-sm text-brand-muted/60 uppercase tracking-widest font-medium">
              Trusted by students and researchers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-[90%] max-w-[1100px] py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Upload", desc: "Drop your PDFs, Docs, or lecture notes into the dashboard." },
            { step: "02", title: "Analyze", desc: "Our AI processes the context and builds a knowledge graph." },
            { step: "03", title: "Chat", desc: "Ask questions, generate summaries, and ace your tasks." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <span className="text-5xl font-black text-white/5 absolute -top-8 left-0 group-hover:text-purple-500/20 transition-colors">
                {item.step}
              </span>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
              <p className="text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="w-[90%] max-w-[1100px] pb-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Powerful Features</h2>
            <p className="text-brand-muted">Everything you need to study smarter, not harder.</p>
          </div>
        </div>
        
        {/* Adjusted grid to 4 columns on large screens to keep it balanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-8 rounded-[30px] flex flex-col items-center text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="h-16 mb-6 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7] mx-1 inline-block animate-pulse"></span>
              <span className="w-4 h-4 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80] mx-1 inline-block animate-pulse [animation-delay:0.2s]"></span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Auto-Tagging</h3>
            <p className="text-sm text-brand-muted leading-relaxed">Automatically organizes your notes by topic and keywords.</p>
          </div>

          <div className="p-8 rounded-[30px] flex flex-col items-center text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="h-16 mb-6 flex items-center justify-center">
              <div className="w-24 h-3 bg-slate-800 rounded-full overflow-hidden p-[2px]">
                <div className="w-[75%] h-full bg-gradient-to-r from-purple-500 to-green-400 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Instant Summary</h3>
            <p className="text-sm text-brand-muted leading-relaxed">Condense 50-page documents into key bullet points instantly.</p>
          </div>

          <div className="p-8 rounded-[30px] flex flex-col items-center text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="h-16 mb-6 flex items-center justify-center">
              <div className="flex gap-1 items-end">
                {[4, 8, 6, 10, 5, 9, 3].map((h, i) => (
                  <div key={i} className="w-1.5 bg-purple-500 rounded-full group-hover:animate-bounce" style={{ height: `${h*4}px`, animationDelay: `${i*0.1}s` }}></div>
                ))}
              </div>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Voice-to-Text</h3>
            <p className="text-sm text-brand-muted leading-relaxed">Record your thoughts or lectures and let AI transcribe them.</p>
          </div>

          <div className="p-8 rounded-[30px] flex flex-col items-center text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="h-16 mb-6 flex items-center justify-center">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🔍</span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Smart Search</h3>
            <p className="text-sm text-brand-muted leading-relaxed">Semantic search that understands the meaning, not just words.</p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;