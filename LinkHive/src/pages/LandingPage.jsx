import React from 'react';
import { 
  IoArrowForward, 
  IoSparkles, 
  IoLink, 
  IoFlash, 
  IoBarChart
  
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { CgBee } from "react-icons/cg";
import '../Styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
       <header className="header">
      <div className="header-container">
        {/* Logo / Brand */}
        <button
          onClick={() => navigate("/")}
          className="logo-button"
          aria-label="LinkHive Home"
        >
          <CgBee className="logo-icon" />
          <span className="brand-name">LinkHive</span>
        </button>

        {/* Navigation */}
        <nav className="navigation">
          <button
            className="nav-button nav-button-ghost"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="nav-button nav-button-primary"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb gradient-orb-1"></div>
          <div className="gradient-orb gradient-orb-2"></div>
          <div className="gradient-orb gradient-orb-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="floating-elements">
          <div className="float-element float-element-1"></div>
          <div className="float-element float-element-2"></div>
          <div className="float-element float-element-3"></div>
          <div className="float-element float-element-4"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text-center">
            <div className="headline-section">
              <h1 className="main-headline">
                <span className="headline-line-1">
                  One Link,
                </span>
                <span className="headline-line-2">
                  Infinite Possibilities
                </span>
              </h1>
              
              <p className="hero-description">
                Create a stunning landing page that showcases all your important links in one place. 
                <br className="description-break" />
                <span className="description-highlight">
                  Perfect for creators, businesses, and anyone who wants to share their digital presence beautifully.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <button
                className="cta-primary"
                onClick={() => navigate('/register')}
              >
                Get Started Free
                <IoArrowForward className="cta-icon" />
              </button>
              
              <button
                className="cta-secondary"
                onClick={() => navigate('/login')}
              >
                Customize your Hive
              </button>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon feature-icon-links">
                    <IoLink className="feature-icon-svg" />
                  </div>
                  <div className="feature-badge feature-badge-green">
                    <div className="feature-badge-dot"></div>
                  </div>
                </div>
                <div className="feature-content">
                  <div className="feature-title">Unlimited Links</div>
                  <div className="feature-description">Add as many links as you need, organize them beautifully</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon feature-icon-customization">
                    <IoFlash className="feature-icon-svg" />
                  </div>
                  <div className="feature-badge feature-badge-primary">
                    <IoSparkles className="feature-badge-icon" />
                  </div>
                </div>
                <div className="feature-content">
                  <div className="feature-title">Easy Customization</div>
                  <div className="feature-description">Match your brand perfectly with themes and colors</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon feature-icon-analytics">
                    <IoBarChart className="feature-icon-svg" />
                  </div>
                  <div className="feature-badge feature-badge-blue">
                    <div className="feature-badge-dot feature-badge-pulse"></div>
                  </div>
                </div>
                <div className="feature-content">
                  <div className="feature-title">Boost your Presence</div>
                  <div className="feature-description">Enhance your online engagement and boost performance metrics</div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="social-proof">
              <p className="social-proof-text">Trusted by creators worldwide</p>
              <div className="social-proof-content">
                <div className="avatars-group">
                  <div className="avatar avatar-1"></div>
                  <div className="avatar avatar-2"></div>
                  <div className="avatar avatar-3"></div>
                  <div className="avatar avatar-4"></div>
                  <div className="avatar avatar-5"></div>
                </div>
                <div className="social-proof-stats">
                  <div className="stats-number"> Happy users</div>
                  <div className="stats-growth">Growing every day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
     <footer className="footer">
      <div className="footer-container">
        {/* Brand Name */}
        <h2 className="footer-brand">LinkHive</h2>

        {/* Mini description */}
        <p className="footer-desc">
          A place to customize and share all your links in one profile.
        </p>

        {/* Social Icons */}
        <div className="footer-icons">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="footer-copy">© {new Date().getFullYear()} LinkHive. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default LandingPage;
