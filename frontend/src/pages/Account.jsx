import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import API from "../api/api";
import "./Account.css";

function Account() {
  const { user } = useAuth();

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        <AccountSidebar />

        <div className="account-content">
          <h1>Account Dashboard</h1>
          
          <TestimonialFormSection />
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <h3>Recent Orders</h3>
              <p>View and track your orders</p>
              <Link to="/account/orders" className="card-link">View Orders →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Wishlist</h3>
              <p>Your saved items</p>
              <Link to="/wishlist" className="card-link">View Wishlist →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Addresses</h3>
              <p>Manage your delivery addresses</p>
              <Link to="/account/addresses" className="card-link">Manage Addresses →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Profile</h3>
              <p>Update your personal information</p>
              <Link to="/account/profile" className="card-link">Edit Profile →</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function TestimonialFormSection() {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setAuthor(user.name || user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please enter your testimonial");
      return;
    }

    if (!author.trim()) {
      setError("Please enter your name");
      return;
    }

    if (text.length < 10) {
      setError("Testimonial must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/testimonials", {
        rating,
        text: text.trim(),
        author: author.trim(),
        role: "Verified Customer"
      });
      setSubmitted(true);
      setText("");
      setRating(5);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setError(error.response?.data?.error || "Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="testimonial-form-card">
      <h2>Share Your Experience</h2>
      <p className="testimonial-form-description">Help us improve by sharing your feedback about your shopping experience.</p>
      
      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-group">
          <label htmlFor="author">Your Name *</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setAuthor(value);
            }}
            placeholder="Enter your name"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Your Rating *</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${rating >= star ? "active" : ""}`}
                onClick={() => setRating(star)}
                disabled={submitting}
              >
                ★
              </button>
            ))}
            <span className="rating-value">{rating} out of 5</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="text">Your Testimonial *</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us about your experience..."
            rows="4"
            required
            disabled={submitting}
            minLength={10}
          />
          <span className="char-count">{text.length} characters (minimum 10)</span>
        </div>

        {error && <div className="error-message">{error}</div>}
        {submitted && <div className="success-message">Thank you! Your testimonial has been submitted.</div>}

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
}

export default Account;

