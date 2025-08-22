// src/pages/PublicProfile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";
import "../Styles/PublicProfile.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function parseJSON(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from server: ${text.slice(0, 120)}...`);
  }
}

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE}/public/${encodeURIComponent(username)}`);
        const data = await parseJSON(res);
        if (!res.ok) throw new Error(data?.message || "Failed to load profile.");
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const handleShare = () => {
    const shareData = {
      title: "Check out my profile",
      text: "Here’s my LinkHive profile 🚀",
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log("Share failed:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profileData) return <div className="empty">No profile found.</div>;

  const { displayName, tagline, background, typography } = profileData;
  const links = (profileData.links || []).map((l) => ({
    siteName: l.siteName ?? l.sitename ?? "",
    siteUsername: l.siteUsername ?? l.siteusername ?? "",
    profileUrl: l.profileUrl ?? l.profileurl ?? "",
  }));

  // background
  const bgStyle =
    background?.type === "color"
      ? { background: background.value }
      : background?.type === "image"
      ? {
          backgroundImage: `url(${
            background.value?.startsWith("http")
              ? background.value
              : `${import.meta.env.BASE_URL}${(background.value || "")
                  .replace(/^\//, "")
                  .trim()}`
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {};

  const fontStyle = {
    color: typography?.color || "#000",
    fontFamily: typography?.font || "Inter, sans-serif",
  };

  return (
    <div className="public-profile-wrapper" style={bgStyle}>
      <div className="background-overlay"></div>

      {/* HEADER */}
      <header className="profile-header">
        <h2 className="brand" onClick={() => navigate("/")}>LinkHive</h2>
        <span className="header-btn" onClick={handleShare}>
          <FiShare2 /> <span>Share</span>
        </span>
      </header>

      {/* FOREGROUND CONTAINER */}
      <main className="profile-foreground" style={fontStyle}>
        <div className="profile-text">
          <h1 className="display-name">{displayName || username}</h1>
          {tagline && <p className="tagline">{tagline}</p>}
        </div>

        <div className="links-container">
          {links.length > 0 ? (
            links.map((link, index) => (
              <div
                key={index}
                className="link-card"
                onClick={() => window.open(link.profileUrl, "_blank")}
              >
                <span className="link-sitename">{link.siteName}</span>
                <p className="link-username">@{link.siteUsername}</p>
              </div>
            ))
          ) : (
            <p className="no-links">No links available</p>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <button className="create-btn" onClick={() => navigate("/register")}>
          Create Yours
        </button>
        <p>Created with LinkHive</p>
      </footer>
    </div>
  );
}
