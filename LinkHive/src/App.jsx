import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CustomizePage from "./pages/CustomizePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PublicProfile from "./pages/PublicProfile"; // ✅ import public profile page
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public profile route */}
        <Route path="/LinkHive/:username" element={<PublicProfile />} />

        {/* Protect the customization page */}
        <Route
          path="/customize"
          element={
            <ProtectedRoute>
              <CustomizePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
