import { useState } from "react";
import "./Logo.css";

function Logo({ variant = "default" }) {
  const uniqueId = variant === "navbar" ? "nav" : "main";
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={`logo-container ${variant}`}>
      <div className="logo-icon">
        {!imageError ? (
          <img 
            src="/logo.png" 
            alt="ShopSwift Logo" 
            className="logo-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            className="logo-svg-fallback"
            viewBox="0 0 220 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            <linearGradient id={`ribbonGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6d28d9" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id={`bagGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id={`screenGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          <g className="logo-graphic" transform="rotate(-2 40 50)">
            <rect x="18" y="12" width="44" height="70" rx="8" fill="#1e3a8a" />
            <rect x="22" y="16" width="36" height="54" rx="6" fill={`url(#screenGrad-${uniqueId})`} />
            
            <rect x="35" y="20" width="10" height="4" rx="2" fill="#1e3a8a" />
            <circle cx="40" cy="65" r="4" fill="#1e3a8a" />
            
            <g transform="translate(28, 22)">
              <path
                d="M12 18 L12 28 L9 28 L9 40 L19 40 L19 28 L22 28 L22 48 L26 48 L26 28 L29 28 L29 40 L39 40 L39 28 L36 28 L36 18 L12 18 Z"
                fill={`url(#bagGrad-${uniqueId})`}
              />
              <path
                d="M19 28 L19 24 L22 24 L22 28 L19 28 Z"
                fill="#ea580c"
              />
              <circle cx="20.5" cy="26" r="3" fill="white" />
              <path
                d="M19.5 26 L20.5 27 L21.5 25"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            
            <path
              d="M8 8 Q25 3 42 8 Q58 16 64 30 Q58 44 42 49 Q25 54 8 49 Q2 44 4 30 Q2 16 8 8 Z"
              fill={`url(#ribbonGrad-${uniqueId})`}
              opacity="0.9"
            />
            
            <path
              d="M58 10 L60 8 L62 10 L60 12 Z"
              fill="#f97316"
              opacity="0.9"
            />
            <path
              d="M64 8 L66 6 L68 8 L66 10 Z"
              fill="#2563eb"
              opacity="0.8"
            />
            <path
              d="M61 5 L63 3 L65 5 L63 7 Z"
              fill="#6d28d9"
              opacity="0.7"
            />
          </g>
        </svg>
        )}
      </div>
      {/* <div className="logo-text-wrapper">
        <span className="logo-text-shop">Shop</span>
        <span className={`logo-text-vibe logo-text-vibe-${uniqueId}`}>Swift</span>
      </div> */}
    </div>
  );
}

export default Logo;

