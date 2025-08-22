// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// ✅ use env variable for API base
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token invalid");
        const userData = await res.json();
        if (!cancelled) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.warn("Auth validation failed:", err.message);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // ✅ login using API_BASE
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    // fetch user profile
    const meRes = await fetch(`${API_BASE}/user`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    if (!meRes.ok) {
      localStorage.removeItem("token");
      setToken(null);
      throw new Error("Failed to fetch user after login");
    }
    const me = await meRes.json();
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
