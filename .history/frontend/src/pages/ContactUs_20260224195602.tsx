import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically integrate your API call
        setSubmitted(true);
    };

    return (
        <div className="contact-page-wrapper">
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Back to Home
            </button>

            <div className="contact-container glass">
                {!submitted ? (
                    <>
                        <div className="contact-header">
                            <h1 className="contact-title">Get in <span className="gradient-highlight">Touch</span></h1>
                            <p className="contact-subtitle">Have questions about Smart Notes AI? We're here to help.</p>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="john@example.com" required />
                            </div>

                            <div className="input-group">
                                <label>Message</label>
                                <textarea rows={5} placeholder="How can we help you?" required></textarea>
                            </div>

                            <button type="submit" className="contact-submit-btn">
                                Send Message
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">Checkmark Icon Or ✨</div>
                        <h2>Message Sent!</h2>
                        <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                        <button className="back-btn-simple" onClick={() => navigate('/')}>Return Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactUs;