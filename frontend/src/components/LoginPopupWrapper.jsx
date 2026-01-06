import { useContext } from "react";
import { LoginPopupContext } from "../context/WishlistContext";
import LoginPopup from "./LoginPopup";

function LoginPopupWrapper() {
  const { showLoginPopup, setShowLoginPopup } = useContext(LoginPopupContext);

  return (
    <LoginPopup 
      isOpen={showLoginPopup} 
      onClose={() => setShowLoginPopup(false)} 
    />
  );
}

export default LoginPopupWrapper;

