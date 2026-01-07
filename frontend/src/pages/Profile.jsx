import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
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
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.profilePhoto) {
        const photoUrl = user.profilePhoto.startsWith('http') 
          ? user.profilePhoto 
          : `${import.meta.env.VITE_API_SERVER_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${user.profilePhoto}`;
        setPhotoPreview(photoUrl);
      } else {
        setPhotoPreview(null);
      }
      setSelectedFile(null);
      setIsNewPhoto(false);
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    if (!validateProfileForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(token, res.data.user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      strength: [minLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length,
    };
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else {
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (passwordValidation.strength < 3) {
        newErrors.newPassword = "Password must contain uppercase, lowercase, and number";
      }
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setIsNewPhoto(true);
    setMessage("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    setPhotoLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      const res = await API.post("/auth/profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      login(token, res.data.user);
      setMessage("Profile photo updated successfully!");
      setSelectedFile(null);
      setIsNewPhoto(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to upload profile photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleDeletePhoto = () => {
    if (!user?.profilePhoto) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeletePhoto = async () => {
    setShowDeleteConfirm(false);
    setPhotoLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await API.delete("/auth/profile-photo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(token, res.data.user);
      setMessage("Profile photo deleted successfully!");
      setPhotoPreview(null);
      setSelectedFile(null);
      setIsNewPhoto(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to delete profile photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleCancelPhoto = () => {
    if (user?.profilePhoto) {
      const photoUrl = user.profilePhoto.startsWith('http') 
        ? user.profilePhoto 
          : `${import.meta.env.VITE_API_SERVER_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${user.profilePhoto}`;
      setPhotoPreview(photoUrl);
    } else {
      setPhotoPreview(null);
    }
    setSelectedFile(null);
    setIsNewPhoto(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setPasswordErrors({});

    if (!validatePasswordForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.put("/auth/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        <AccountSidebar />

        <div className="account-content">
          <h1>Profile Settings</h1>

          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="profile-photo-section">
            <h2>Profile Photo</h2>
            <div className="photo-upload-container">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" />
                ) : (
                  <div className="photo-placeholder">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                {photoLoading && <div className="photo-loading">Uploading...</div>}
              </div>
              <div className="photo-actions">
                <label htmlFor="profile-photo-input" className="photo-btn photo-change-btn">
                  Change Photo
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={photoLoading}
                  style={{ display: "none" }}
                />
                {isNewPhoto && (
                  <>
                    <button
                      type="button"
                      className="photo-btn photo-save-btn"
                      onClick={handleSavePhoto}
                      disabled={photoLoading}
                    >
                      {photoLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="photo-btn photo-cancel-btn"
                      onClick={handleCancelPhoto}
                      disabled={photoLoading}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {!isNewPhoto && user?.profilePhoto && (
                  <button
                    type="button"
                    className="photo-btn photo-delete-btn"
                    onClick={handleDeletePhoto}
                    disabled={photoLoading}
                  >
                    {photoLoading ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setFormData({ ...formData, name: value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={errors.name ? "error" : ""}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                className={errors.phone ? "error" : ""}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <form className="profile-form" onSubmit={handleChangePassword}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                  }}
                  className={passwordErrors.currentPassword ? "error" : ""}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && <span className="error-message">{passwordErrors.currentPassword}</span>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: "" });
                  }}
                  className={passwordErrors.newPassword ? "error" : ""}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && <span className="error-message">{passwordErrors.newPassword}</span>}
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                    if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                  }}
                  className={passwordErrors.confirmPassword ? "error" : ""}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && <span className="error-message">{passwordErrors.confirmPassword}</span>}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={confirmDeletePhoto}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content cancel-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Profile Photo</h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="confirm-message">
            Are you sure you want to delete your profile photo? This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="cancel-modal-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-modal-btn" onClick={onConfirm}>
            Yes, Delete Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

