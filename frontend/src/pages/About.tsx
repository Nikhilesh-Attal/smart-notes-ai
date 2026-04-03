// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBolt, faLock, faBrain } from '@fortawesome/free-solid-svg-icons';
// import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

// const About = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col items-center pb-24">
//             <main className="w-full flex flex-col items-center">
//                 {/* Hero Section */}
//                 <section className="text-center px-5 py-16 max-w-[900px]">
//                     <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-tight mb-5">
//                         Empowering Minds with <br />
//                         <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">Artificial Intelligence</span>
//                     </h1>
//                     <p className="text-xl text-brand-muted max-w-[700px] mx-auto">
//                         Smart Notes AI is dedicated to bridging the gap between raw information and actionable knowledge.
//                     </p>
//                 </section>

//                 {/* Mission Section */}
//                 <section className="mx-5 my-10 px-16 py-16 max-w-[1000px] rounded-[40px] text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light">
//                     <div>
//                         <h2 className="text-2xl font-bold text-brand-green-light mb-5">Our Mission</h2>
//                         <p className="text-lg leading-relaxed text-slate-300">
//                             In an age of information overload, we believe that capturing and organizing thoughts
//                             should be effortless. Our mission is to build the world's most intuitive AI-powered
//                             note-taking ecosystem.
//                         </p>
//                     </div>
//                 </section>

//                 {/* Values Grid */}
//                 <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 w-[90%] max-w-[1100px] mt-16">
//                     <div className="p-10 rounded-[30px] text-left bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:-translate-y-2.5 hover:border-brand-green transition-all duration-300">
//                         <div className="text-3xl mb-4 text-brand-green-light"><FontAwesomeIcon icon={faBolt} /></div>
//                         <h3 className="mb-2.5 text-white font-semibold">Speed</h3>
//                         <p className="text-brand-muted text-sm">Instant summarization and tagging to save you hours of manual work.</p>
//                     </div>
//                     <div className="p-10 rounded-[30px] text-left bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:-translate-y-2.5 hover:border-brand-green transition-all duration-300">
//                         <div className="text-3xl mb-4 text-brand-green-light"><FontAwesomeIcon icon={faLock} /></div>
//                         <h3 className="mb-2.5 text-white font-semibold">Privacy</h3>
//                         <p className="text-brand-muted text-sm">Your data is encrypted and secure. We value your privacy above all else.</p>
//                     </div>
//                     <div className="p-10 rounded-[30px] text-left bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:-translate-y-2.5 hover:border-brand-green transition-all duration-300">
//                         <div className="text-3xl mb-4 text-brand-green-light"><FontAwesomeIcon icon={faBrain} /></div>
//                         <h3 className="mb-2.5 text-white font-semibold">Intelligence</h3>
//                         <p className="text-brand-muted text-sm">Powered by the latest LLMs to ensure high-accuracy content generation.</p>
//                     </div>
//                 </div>

//                 {/* Developers Section */}
//                 <section className="mt-24 w-full max-w-[1000px] text-center">
//                     <h2 className="text-4xl mb-10 font-extrabold">
//                         Meet the <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">Developers</span>
//                     </h2>
//                     <div className="flex justify-center gap-8 flex-wrap">
//                         <div className="p-10 rounded-[30px] w-72 text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:-translate-y-2.5 hover:border-brand-green transition-all duration-300">
//                             <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-purple-500 rounded-full mx-auto mb-5 flex items-center justify-center font-extrabold text-2xl text-brand-dark">NA</div>
//                             <h3 className="text-xl mb-1 text-white font-semibold">Nikhilesh Attal</h3>
//                             <p className="text-brand-green-light font-semibold text-sm uppercase tracking-wider mb-3">Backend Developer</p>
//                             <p className="text-brand-muted text-sm leading-relaxed mb-4">Nikhilesh Attal is AI-powered Full Stack Developer. Also have knowlegde in building automation workflows using n8n.</p>
//                             <div className="flex justify-center gap-4">
//                                 <a href="https://github.com/Nikhilesh-Attal" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-white text-lg transition-colors duration-200">
//                                     <FontAwesomeIcon icon={faGithub} />
//                                 </a>
//                                 <a href="www.linkedin.com/in/nikhilesh-attal" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-white text-lg transition-colors duration-200">
//                                     <FontAwesomeIcon icon={faLinkedinIn} />
//                                 </a>
//                             </div>
//                         </div>
//                         <div className="p-10 rounded-[30px] w-72 text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light hover:-translate-y-2.5 hover:border-brand-green transition-all duration-300">
//                             <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-purple-500 rounded-full mx-auto mb-5 flex items-center justify-center font-extrabold text-2xl text-brand-dark">LS</div>
//                             <h3 className="text-xl mb-1 text-white font-semibold">Lavish Singhvi</h3>
//                             <p className="text-brand-green-light font-semibold text-sm uppercase tracking-wider">Frontend Developer</p>
//                         </div>
//                     </div>
//                 </section>

//                 {/* CTA Section */}
//                 <section className="mt-24 text-center">
//                     <h2 className="mb-8 text-3xl font-bold text-white">Ready to transform your notes?</h2>
//                     <button
//                         className="bg-brand-green text-brand-dark px-12 py-5 rounded-full border-none font-extrabold text-lg cursor-pointer shadow-[0_4px_15px_rgba(56,193,106,0.3)] hover:bg-brand-green-hover hover:scale-105 hover:shadow-[0_8px_25px_rgba(56,193,106,0.4)] transition-all duration-300"
//                         onClick={() => navigate('/signup')}
//                     >
//                         Join Smart Notes AI
//                     </button>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default About;


import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faLock, faBrain, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col items-center pb-24 font-sans selection:bg-brand-green/30">
            
            {/* Minimalist Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl -z-10"></div>

            <main className="w-full max-w-[1200px] px-6">
                
                {/* Hero Section - Refined Scale */}
                <section className="text-center py-20 md:py-32">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                        Empowering Minds with <br />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Artificial Intelligence
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-brand-muted max-w-[600px] mx-auto leading-relaxed">
                        Bridging the gap between raw information and actionable knowledge through 
                        intuitive, AI-driven synthesis.
                    </p>
                </section>

                {/* Mission Section - Professional Layout */}
                <section className="relative p-1 border border-white/5 bg-white/[0.02] rounded-[40px] overflow-hidden group">
                    <div className="bg-brand-dark/40 backdrop-blur-3xl rounded-[36px] px-8 py-16 md:px-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-6">
                                Our Mission
                            </h2>
                            <p className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-8">
                                To build a seamless ecosystem where capturing, organizing, and 
                                understanding thoughts is effortless for everyone.
                            </p>
                            <div className="w-12 h-1 bg-brand-green/20 mx-auto rounded-full"></div>
                        </div>
                    </div>
                </section>

                {/* Values Grid - Standardized */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {[
                        { icon: faBolt, title: "Efficiency", desc: "Process hours of content into minutes of focused reading." },
                        { icon: faLock, title: "Security", desc: "Your data is encrypted end-to-end. We prioritize user privacy above all." },
                        { icon: faBrain, title: "Context", desc: "Our AI understands the 'why' behind your notes, not just the 'what'." }
                    ].map((item, index) => (
                        <div key={index} className="p-8 rounded-3xl bg-brand-glass border border-brand-border-light hover:border-white/10 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-6">
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Developers Section - Portfolio Style */}
                <section className="mt-32">
                    <div className="flex flex-col items-center justify-center mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            The Developers
                        </h2>
                        <p className="text-brand-muted text-sm font-medium mt-2">
                            Engineering the future of Smart Notes AI
                        </p>
                        
                        {/* Modern Centered Divider - replaces the horizontal line */}
                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-px w-8 bg-brand-green/20"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green/40"></div>
                            <div className="h-px w-8 bg-brand-green/20"></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nikhilesh Card */}
                        <div className="p-8 rounded-3xl bg-brand-glass border border-brand-border-light flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:bg-white/[0.04] hover:border-brand-green/20 transition-all duration-300">
                            <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-brand-green to-purple-500 rounded-2xl flex items-center justify-center font-bold text-xl text-brand-dark shadow-lg">NA</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white">Nikhilesh Attal</h3>
                                <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mb-3">Backend & Automation</p>
                                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                                    Specializing in scalable architectures and AI-driven automation. Building the core processing engine.
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest mr-2">Connect:</span>
                                    <a href="https://github.com/Nikhilesh-Attal" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-green/20 transition-all">
                                        <FontAwesomeIcon icon={faGithub} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/nikhilesh-attal" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-all">
                                        <FontAwesomeIcon icon={faLinkedinIn} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Lavish Card */}
                        <div className="p-8 rounded-3xl bg-brand-glass border border-brand-border-light flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:bg-white/[0.04] hover:border-brand-green/20 transition-all duration-300">
                            <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-purple-500 to-brand-green rounded-2xl flex items-center justify-center font-bold text-xl text-brand-dark shadow-lg">LS</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white">Love Singhvi</h3>
                                <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mb-3">Frontend & UI/UX</p>
                                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                                    Designing the bridge between human thought and AI. Focused on clean, responsive, and intuitive interfaces.
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest mr-2">Connect:</span>
                                    <a href="https://github.com/LoveSinghvi" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-green/20 transition-all">
                                        <FontAwesomeIcon icon={faGithub} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/lavishsinghvi97" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-all">
                                        <FontAwesomeIcon icon={faLinkedinIn} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section - Minimalist */}
                <section className="mt-32 mb-20 p-12 md:p-20 rounded-[40px] bg-brand-green/5 border border-brand-green/10 flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Start optimizing your knowledge.</h2>
                    <button
                        className="bg-brand-green text-brand-dark px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] transition-all flex items-center gap-3"
                        onClick={() => navigate('/signup')}
                    >
                        Get Started
                        <FontAwesomeIcon icon={faArrowRight} size="sm" />
                    </button>
                </section>
            </main>
        </div>
    );
};

export default About;