import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 1. Import the solid icons for your Value Cards
import { faBolt, faLock, faBrain } from '@fortawesome/free-solid-svg-icons';

// 2. Import the brand icons for your Developer Socials
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page-wrapper">
            <main className="about-content">
                {/* Hero Section */}
                <section className="about-hero">
                    <h1 className="about-title">
                        Empowering Minds with <br />
                        <span className="gradient-highlight">Artificial Intelligence</span>
                    </h1>
                    <p className="about-tagline">
                        Smart Notes AI is dedicated to bridging the gap between raw information and actionable knowledge.
                    </p>
                </section>

                {/* Mission Section */}
                <section className="mission-container glass">
                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p>
                            In an age of information overload, we believe that capturing and organizing thoughts 
                            should be effortless. Our mission is to build the world's most intuitive AI-powered 
                            note-taking ecosystem.
                        </p>
                    </div>
                </section>

                {/* Values Grid */}
                <div className="values-grid">
                    <div className="value-card glass">
                        <div className="value-icon"><FontAwesomeIcon icon={faBolt} /></div>
                        <h3>Speed</h3>
                        <p>Instant summarization and tagging to save you hours of manual work.</p>
                    </div>
                    <div className="value-card glass">
                        <div className="value-icon"><FontAwesomeIcon icon={faLock} /></div>
                        <h3>Privacy</h3>
                        <p>Your data is encrypted and secure. We value your privacy above all else.</p>
                    </div>
                    <div className="value-card glass">
                        <div className="value-icon"><FontAwesomeIcon icon={faBrain} /></div>
                        <h3>Intelligence</h3>
                        <p>Powered by the latest LLMs to ensure high-accuracy content generation.</p>
                    </div>
                </div>

                {/* Developers Section */}
                <section className="developers-section">
                    <h2 className="section-title">Meet the <span className="gradient-highlight">Developers</span></h2>
                    <div className="dev-grid">
                        <div className="dev-card glass">
                            <div className="dev-avatar">NA</div>
                            <h3>Nikhilesh Attal</h3>
                            <p className="dev-role">Backend Developer</p>
                            <p className='bio-blog'>Nikhilesh Attal is AI-powered Full Stack Developer. Also have knowlegde in building automation workflows using n8n.</p>
                            <p className='social-links'>
                                <a href="https://github.com/Nikhilesh-Attal" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                                <a href="www.linkedin.com/in/nikhilesh-attal" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </a>
                            </p>
                        </div>
                        <div className="dev-card glass">
                            <div className="dev-avatar">LS</div>
                            <h3>Lavish Singhvi</h3>
                            <p className="dev-role">Frontend Developer</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <h2>Ready to transform your notes?</h2>
                    <button className="about-primary-btn" onClick={() => navigate('/signup')}>
                        Join Smart Notes AI
                    </button>
                </section>
            </main>
        </div>
    );
};

export default About;