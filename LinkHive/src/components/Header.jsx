import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">LinkHive</div>
      <nav>
        <a href="#about">About Us</a>
        <a href="#login">Login</a>
      </nav>
    </header>
  );
}
