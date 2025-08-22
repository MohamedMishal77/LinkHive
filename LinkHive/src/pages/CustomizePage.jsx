// src/pages/CustomizationPage.jsx
import React, { useState, useEffect } from "react";
import "../Styles/CustomizationPage.css";
import { useNavigate, Link } from "react-router-dom";
import { CgBee } from "react-icons/cg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// safer JSON parse to surface backend HTML/404 responses
async function parseJSON(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from server: ${text.slice(0, 120)}...`);
  }
}

// normalize old link shapes -> new camelCase
function normalizeLinks(arr = []) {
  return arr.map((l) => ({
    siteName: l.siteName ?? l.sitename ?? "",
    siteUsername: l.siteUsername ?? l.siteusername ?? "",
    profileUrl: l.profileUrl ?? l.profileurl ?? "",
  }));
}

export default function CustomizationPage() {
  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");
  const [links, setLinks] = useState([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteUsername, setSiteUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [bgType, setBgType] = useState("color");
  const [bgValue, setBgValue] = useState("#f0f0f0");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontStyle, setFontStyle] = useState("Arial");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const navigate = useNavigate();

  // store these as relative paths; use BASE_URL only when rendering
  const predefinedImages = [
    "backgrounds/1.png",
    "backgrounds/2.png",
    "backgrounds/3.png",
    "backgrounds/4.png",
    "backgrounds/5.png",
    "backgrounds/6.png",
    "backgrounds/7.png",
  ];

  const lightColors = [
    { name: "Light Gray", value: "#f0f0f0" },
    { name: "Lemon Chiffon", value: "#fffacd" },
    { name: "Light Blue", value: "#e6f7ff" },
    { name: "Light Pink", value: "#fce4ec" },
    { name: "Lavender", value: "#f3e5f5" },
    { name: "Honeydew", value: "#f0fff0" },
  ];

  // load saved customization
  useEffect(() => {
    const fetchCustomization = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/customization`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await parseJSON(res);

        if (res.ok && data) {
          setDisplayName(data.displayName || "");
          setTagline(data.tagline || "");
          setLinks(normalizeLinks(data.links));
          setBgType(data.background?.type || "color");
          setBgValue(data.background?.value || "#f0f0f0");
          setFontColor(data.typography?.color || "#000000");
          setFontStyle(data.typography?.font || "Arial");
        } else {
          setSaveMsg(data?.message || "Failed to load customization.");
        }
      } catch (err) {
        console.error("Failed to fetch customization:", err);
        setSaveMsg(err.message || "Failed to load customization.");
      }
    };

    fetchCustomization();
  }, [navigate]);

  const addLink = () => {
    if (!siteName || !siteUsername || !profileUrl || links.length >= 50) return;
    let formattedUrl = profileUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }
    const newLink = { siteName, siteUsername, profileUrl: formattedUrl };
    setLinks((prev) => [...prev, newLink]);
    setSiteName("");
    setSiteUsername("");
    setProfileUrl("");
    setShowLinkForm(false);
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async () => {
    setSaveMsg("");

    if (!displayName.trim()) {
      setSaveMsg("Please enter a display name.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSaveMsg("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const payload = {
      displayName: displayName.trim(),
      tagline: tagline.trim(),
      background: { type: bgType, value: bgValue }, // value is relative path or full URL
      typography: { color: fontColor, font: fontStyle },
      links, // camelCase keys
    };

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/customization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJSON(res);

      if (res.status === 401) {
        setSaveMsg("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        setSaveMsg(data?.message || "Failed to save customization.");
        setSaving(false);
        return;
      }

      setSaveMsg("Saved! Redirecting to your public page…");
      setSaving(false);
      navigate(`/LinkHive/${data.username}`);
    } catch (err) {
      console.error("Save customization error:", err);
      setSaveMsg(err.message || "Server error. Please try again.");
      setSaving(false);
    }
  };

  // Build preview URL for local images
  const bgPreviewUrl =
    bgType === "image"
      ? (bgValue?.startsWith("http")
          ? bgValue
          : `${import.meta.env.BASE_URL}${(bgValue || "")
              .replace(/^\//, "")
              .trim()}`)
      : null;

  return (
    <div className="customization-wrapper">
      {/* Page Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo-button">
            <CgBee className="logo-icon" />
            <span className="brand-name">LinkHive</span>
          </Link>

          <nav className="navigation">
            <button onClick={handleLogout} className="nav-button nav-button-ghost">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="customization-container">
        {/* Left Column - Form */}
        <div className="form-section fixed-height">
          <h2>Enter Your Details</h2>

          <label>Display Name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

          <label>Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} />

          {/* Background Section */}
          <div className="bg-section">
            <label>Background Type</label>
            <div className="radio-options">
              <label>
                <input
                  type="radio"
                  value="color"
                  checked={bgType === "color"}
                  onChange={(e) => setBgType(e.target.value)}
                />
                Color
              </label>
              <label>
                <input
                  type="radio"
                  value="image"
                  checked={bgType === "image"}
                  onChange={(e) => setBgType(e.target.value)}
                />
                Image
              </label>
            </div>

            {bgType === "color" ? (
              <select
                value={bgValue}
                onChange={(e) => setBgValue(e.target.value)}
                className="custom-select"
              >
                {lightColors.map((color, i) => (
                  <option key={i} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="image-options">
                {predefinedImages.map((relPath, i) => {
                  const displaySrc = `${import.meta.env.BASE_URL}${relPath}`;
                  const valueToStore = `/${relPath}`; // save as /backgrounds/1.png
                  return (
                    <img
                      key={i}
                      src={displaySrc}
                      alt="Background option"
                      onClick={() => setBgValue(valueToStore)}
                      className={bgValue === valueToStore ? "selected" : ""}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Font Customization */}
          <div className="font-section">
            <div className="font-option">
              <label>Font Color</label>
              <select
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="custom-select"
              >
                <option value="#000000">Black</option>
                <option value="#ffffff">White</option>
                <option value="#333333">Dark Gray</option>
                <option value="#ff0000">Red</option>
                <option value="#0000ff">Blue</option>
                <option value="#008000">Green</option>
              </select>
            </div>

            <div className="font-option">
              <label>Font Style</label>
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="custom-select"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
          </div>

          {/* Add Link & Submit */}
          <div className="button-row">
            <button
              className="add-link-btn"
              onClick={() => setShowLinkForm(true)}
              disabled={links.length >= 50}
            >
              + Add Link
            </button>
            <button className="submit-btn" disabled={saving} onClick={handleSubmit}>
              {saving ? "Saving..." : "Submit"}
            </button>
          </div>

          {saveMsg && (
            <p
              style={{
                marginTop: 10,
                color: saveMsg.toLowerCase().includes("saved") ? "green" : "#cc0000",
              }}
            >
              {saveMsg}
            </p>
          )}
        </div>

        {/* Right Column - Live Preview */}
        <div
          className="preview-section"
          style={{
            background:
              bgType === "color"
                ? bgValue
                : `url(${bgPreviewUrl || ""}) center/cover no-repeat`,
            color: fontColor,
            fontFamily: fontStyle,
          }}
        >
          <h1>{displayName || "Your Display Name"}</h1>
          <p>{tagline || "Your Tagline"}</p>

          <div className="links-preview">
            {links.map((link, index) => (
              <div key={index} className="link-card">
                <small style={{ color: fontColor }}>
                  {link.siteName || link.sitename}
                </small>
                <p style={{ color: fontColor }}>
                  {link.siteUsername || link.siteusername}
                </p>

                <button
                  className="delete-btn"
                  onClick={() => removeLink(index)}
                  title="Remove link"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Popup for Adding Link */}
      {showLinkForm && (
        <div className="modal-overlay" onClick={() => setShowLinkForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add a Link</h3>
            <input
              placeholder="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <input
              placeholder="Site Username"
              value={siteUsername}
              onChange={(e) => setSiteUsername(e.target.value)}
            />
            <input
              placeholder="Profile URL"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={addLink}>Done</button>
              <button onClick={() => setShowLinkForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
