import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastContainer";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import "./Addresses.css";

function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    type: "home",
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showToast("Failed to load addresses. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
      newErrors.city = "City can only contain letters and spaces";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode.replace(/\D/g, ""))) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const addressData = {
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ""),
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode.replace(/\D/g, ""),
        country: formData.country || "India",
        type: formData.type,
      };
      if (editingId) {
        await API.put(`/addresses/${editingId}`, addressData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/addresses", addressData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchAddresses();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        type: "home",
      });
      setErrors({});
      showToast(editingId ? "Address updated successfully" : "Address added successfully", "success");
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage = error.response?.data?.error || "Failed to save address. Please try again.";
      setErrors({ submit: errorMessage });
      showToast(errorMessage, "error");
    }
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.addressLine1 || address.address || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || "India",
      type: address.type || "home",
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddressToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    setShowDeleteConfirm(false);
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/addresses/${addressToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
      setAddressToDelete(null);
      showToast("Address deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting address:", error);
      setAddressToDelete(null);
      showToast("Failed to delete address. Please try again.", "error");
    }
  };

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        <AccountSidebar />

        <div className="account-content">
          <h1>My Addresses</h1>
        {!showForm && (
          <button className="add-address-btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", phone: "", address: "", city: "", state: "", pincode: "", country: "India", type: "home" }); }}>
            + Add New Address
          </button>
        )}

        {showForm && (
          <form className="address-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            <div className="form-row">
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
                  required
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                className={errors.address ? "error" : ""}
                required
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({ ...formData, city: value });
                    if (errors.city) setErrors({ ...errors, city: "" });
                  }}
                  className={errors.city ? "error" : ""}
                  required
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: "" });
                  }}
                  className={errors.state ? "error" : ""}
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData({ ...formData, pincode: value });
                    if (errors.pincode) setErrors({ ...errors, pincode: "" });
                  }}
                  className={errors.pincode ? "error" : ""}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  required
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select
                  value={formData.country}
                  disabled
                  className={errors.country ? "error" : ""}
                >
                  <option value="India">India</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Address</button>
              <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }}>Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="empty-state">
            <p>No addresses saved yet. Add your first address above.</p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                <div className="address-header">
                  <h3>{address.name}</h3>
                </div>
                <div className="address-body">
                  <p className="address-details">
                    {address.addressLine1 || address.address}, {address.city}, {address.state} - {address.pincode}, {address.country || "India"}
                  </p>
                  <p className="address-phone">Phone: {address.phone}</p>
                </div>
                <div className="address-actions">
                  <button onClick={() => handleEdit(address)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(address.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={confirmDeleteAddress}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setAddressToDelete(null);
          }}
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
          <h2>Delete Address</h2>
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
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="cancel-modal-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-modal-btn" onClick={onConfirm}>
            Yes, Delete Address
          </button>
        </div>
      </div>
    </div>
  );
}

export default Addresses;

