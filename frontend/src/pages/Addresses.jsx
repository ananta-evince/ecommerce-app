import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    type: "home",
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await API.put(`/addresses/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/addresses", formData, {
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
        type: "home",
      });
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/addresses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <div className="addresses-page">
      <Navbar />
      <div className="addresses-container">
        <h1>My Addresses</h1>
        <button className="add-address-btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", phone: "", address: "", city: "", state: "", pincode: "", type: "home" }); }}>
          + Add New Address
        </button>

        {showForm && (
          <form className="address-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
            <div className="form-row">
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
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                />
              </div>
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
            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Address</button>
              <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
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
                  <span className="address-type">{address.type}</span>
                </div>
                <p className="address-details">
                  {address.address}, {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="address-phone">Phone: {address.phone}</p>
                <div className="address-actions">
                  <button onClick={() => handleEdit(address)}>Edit</button>
                  <button onClick={() => handleDelete(address.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Addresses;

