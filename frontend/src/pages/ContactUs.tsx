import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-5 relative">
            <button
                className="absolute top-8 left-8 bg-transparent border-none text-brand-green-light font-semibold cursor-pointer hover:-translate-x-1 transition-all duration-300"
                onClick={() => navigate('/')}
            >
                ← Back to Home
            </button>

            <div className="w-full max-w-[600px] p-12 rounded-[40px] text-center bg-brand-glass backdrop-blur-xl border border-brand-border-light">
                {!submitted ? (
                    <>
                        <div className="mb-10">
                            <h1 className="text-4xl font-extrabold text-white mb-2.5">
                                Get in <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">Touch</span>
                            </h1>
                            <p className="text-brand-muted text-lg">Have questions about Smart Notes AI? We're here to help.</p>
                        </div>

                        <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-sm font-semibold pl-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="bg-brand-glass-hover border border-brand-border-light rounded-2xl px-4 py-4 text-white outline-none focus:border-brand-green focus:bg-brand-glass-focus transition-all duration-300 placeholder-brand-subtle"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-sm font-semibold pl-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="bg-brand-glass-hover border border-brand-border-light rounded-2xl px-4 py-4 text-white outline-none focus:border-brand-green focus:bg-brand-glass-focus transition-all duration-300 placeholder-brand-subtle"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-sm font-semibold pl-1">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="How can we help you?"
                                    required
                                    className="bg-brand-glass-hover border border-brand-border-light rounded-2xl px-4 py-4 text-white font-[inherit] outline-none focus:border-brand-green focus:bg-brand-glass-focus transition-all duration-300 resize-none placeholder-brand-subtle"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="mt-2.5 bg-brand-green text-brand-dark border-none py-4 rounded-full font-extrabold text-base cursor-pointer shadow-[0_4px_15px_rgba(56,193,106,0.3)] hover:bg-brand-green-hover hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,193,106,0.4)] transition-all duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="py-10">
                        <div className="text-5xl mb-5">✨</div>
                        <h2 className="text-white text-2xl font-bold mb-4">Message Sent!</h2>
                        <p className="text-brand-muted mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                        <button
                            className="bg-transparent border border-brand-green text-brand-green px-7 py-3 rounded-full cursor-pointer hover:bg-brand-green hover:text-brand-dark transition-all duration-300 font-semibold"
                            onClick={() => navigate('/')}
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactUs;