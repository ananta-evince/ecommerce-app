import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  return children;
}

export default PublicRoute;

