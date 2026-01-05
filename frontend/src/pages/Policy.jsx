import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Policy.css";

function Policy() {
  const location = window.location.pathname;
  const type = location.includes("privacy") ? "privacy-policy" 
    : location.includes("terms") ? "terms"
    : location.includes("returns") ? "returns"
    : location.includes("shipping") ? "shipping"
    : "privacy-policy";

  const policies = {
    "privacy-policy": {
      title: "Privacy Policy",
      content: `
        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including when you create an account, make a purchase, or contact us for support.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to process your orders, communicate with you, and improve our services.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share your information with service providers who assist us in operating our website and conducting our business.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time by contacting us.</p>
      `
    },
    "terms": {
      title: "Terms & Conditions",
      content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Product Information</h2>
        <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.</p>
        
        <h2>4. Pricing</h2>
        <p>All prices are subject to change without notice. We reserve the right to modify prices at any time.</p>
        
        <h2>5. Limitation of Liability</h2>
        <p>In no event shall ShopSwift or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
      `
    },
    "returns": {
      title: "Return & Refund Policy",
      content: `
        <h2>1. Return Eligibility</h2>
        <p>Items can be returned within 30 days of delivery. Items must be unused, unwashed, and in their original packaging with tags attached.</p>
        
        <h2>2. Return Process</h2>
        <p>To initiate a return, please contact our customer service team. We will provide you with a return authorization and shipping instructions.</p>
        
        <h2>3. Refund Processing</h2>
        <p>Once we receive and inspect your returned item, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method.</p>
        
        <h2>4. Exchanges</h2>
        <p>We offer exchanges for items in different sizes or colors, subject to availability. Please contact us to arrange an exchange.</p>
        
        <h2>5. Non-Returnable Items</h2>
        <p>Certain items such as personalized products, intimate apparel, and sale items marked as final sale are not eligible for return.</p>
      `
    },
    "shipping": {
      title: "Shipping Policy",
      content: `
        <h2>1. Shipping Methods</h2>
        <p>We offer various shipping options including standard shipping, express shipping, and overnight delivery. Shipping costs vary based on the method selected.</p>
        
        <h2>2. Processing Time</h2>
        <p>Orders are typically processed within 1-2 business days. Processing time may be longer during peak seasons or for custom orders.</p>
        
        <h2>3. Delivery Time</h2>
        <p>Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. Delivery times may vary based on your location.</p>
        
        <h2>4. Shipping Costs</h2>
        <p>Shipping costs are calculated at checkout based on the shipping method and delivery address. Free shipping is available on orders over ₹999.</p>
        
        <h2>5. International Shipping</h2>
        <p>We currently ship to select international locations. International shipping costs and delivery times vary by destination.</p>
        
        <h2>6. Order Tracking</h2>
        <p>Once your order ships, you will receive a tracking number via email to monitor your shipment's progress.</p>
      `
    }
  };

  const policy = policies[type] || policies["privacy-policy"];

  return (
    <div className="policy-page">
      <Navbar />
      <div className="policy-container">
        <h1>{policy.title}</h1>
        <div className="policy-content" dangerouslySetInnerHTML={{ __html: policy.content }} />
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <Footer />
    </div>
  );
}

export default Policy;

