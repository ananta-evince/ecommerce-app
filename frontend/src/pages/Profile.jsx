import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Profile.css";

function Profile() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(token, res.data.user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await API.put("/auth/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3>{user?.name || "User"}</h3>
          <p>{user?.email || ""}</p>
        </div>

        <div className="profile-content">
          <h1>Profile Settings</h1>

          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <form className="profile-form" onSubmit={handleChangePassword}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

