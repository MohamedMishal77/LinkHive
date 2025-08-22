// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CgBee } from "react-icons/cg";
import "../Styles/Login.css"; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      setLoading(false);
      navigate("/customize");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo-button">
            <CgBee className="logo-icon" />
            <span className="brand-name">LinkHive</span>
          </Link>
          <nav className="navigation">
            <Link to="/register" className="nav-button nav-button-ghost">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="register-main">
        <div className="form-card">
          <h2 className="form-title">Login</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="input"
            />
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <div className="status-popup error">{error}</div>}

          <p className="already-user">
            Not a user?{" "}
            <Link to="/register" className="link">
              Register here
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}
