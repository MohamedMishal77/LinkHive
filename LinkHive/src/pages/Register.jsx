// src/pages/Register.jsx
import React, { useState } from "react";
import "../Styles/Register.css";
import { useNavigate, Link } from "react-router-dom";
import { CgBee } from "react-icons/cg";

// ✅ import API base from env
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setStatus({ success: false, message: "All fields are required" });
      return;
    }

    try {
      setLoading(true);
      // ✅ use API_BASE
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.token) localStorage.setItem("token", data.token);
        setStatus({ success: true, message: "Registration successful!" });
        setFormData({ username: "", email: "", password: "" });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setStatus({
          success: false,
          message: data.message || "Registration failed",
        });
      }
    } catch (error) {
      setLoading(false);
      setStatus({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <Link to="/" className="logo-button">
              <CgBee className="logo-icon" />
              <span className="brand-name">LinkHive</span>
            </Link>
          </div>
          <nav className="navigation">
            <Link to="/login" className="nav-button nav-button-ghost">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Form Section */}
      <main className="register-main">
        <div className="form-card">
          <h2 className="form-title">Create an Account</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Status Message */}
          {status.message && (
            <div
              className={
                status.success ? "status-popup success" : "status-popup error"
              }
            >
              {status.message}
            </div>
          )}

          {/* Already a user */}
          <p className="already-user">
            Already a user?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
