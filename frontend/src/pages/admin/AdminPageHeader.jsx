import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PATH_TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
};

function AdminPageHeader({ title, children }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathTitle = PATH_TITLES[location.pathname] || title;

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <nav className="admin-header-breadcrumb">
          <Link to="/admin">Admin</Link>
          <span className="admin-header-sep">/</span>
          <span className="admin-header-current">{pathTitle}</span>
        </nav>
        <h2 className="admin-header-title">{pathTitle}</h2>
      </div>
      <div className="admin-header-right">
        {children}
        <span className="admin-header-user">{user?.email}</span>
      </div>
    </header>
  );
}

export default AdminPageHeader;
