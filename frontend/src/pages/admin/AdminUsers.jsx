import { useState, useEffect } from "react";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import AdminPageHeader from "./AdminPageHeader";
import AdminMessageModal from "./AdminMessageModal";
import AdminConfirmModal from "./AdminConfirmModal";
import AdminPagination from "./AdminPagination";
import "./AdminUsers.css";

const LIMIT = 10;

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [messageModal, setMessageModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    API.get("/admin/users", { params: { page, limit: LIMIT } })
      .then((res) => {
        setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
        setTotal(res.data?.total ?? 0);
        setTotalPages(res.data?.totalPages ?? 1);
      })
      .catch(() => {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const updateRole = (userId, role) => {
    API.put(`/admin/users/${userId}/role`, { role })
      .then(() => fetchUsers())
      .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Update failed" }));
  };

  const deleteUser = (userId, role) => {
    if (role === "admin") {
      setMessageModal({ title: "Not allowed", message: "Cannot delete admin user." });
      return;
    }
    setConfirmModal({
      title: "Delete user",
      message: "Are you sure you want to delete this user?",
      confirmLabel: "Delete",
      onConfirm: () => {
        setConfirmModal(null);
        API.delete(`/admin/users/${userId}`)
          .then(() => fetchUsers())
          .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Delete failed" }));
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  if (loading) return <div className="admin-users"><div className="admin-content"><div className="admin-loading">Loading users...</div></div></div>;

  return (
    <div className="admin-users">
      <AdminPageHeader />
      <div className="admin-content">
        {total > 0 && (
          <p className="admin-pagination-summary" style={{ marginBottom: 12 }}>
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} users
          </p>
        )}
        {messageModal && (
          <AdminMessageModal
            title={messageModal.title}
            message={messageModal.message}
            onClose={() => setMessageModal(null)}
          />
        )}
        {confirmModal && (
          <AdminConfirmModal
            title={confirmModal.title}
            message={confirmModal.message}
            confirmLabel={confirmModal.confirmLabel}
            onConfirm={confirmModal.onConfirm}
            onCancel={confirmModal.onCancel}
          />
        )}
        <div className="admin-table-wrap">
          {users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        disabled={u.id === currentUser?.id}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn danger"
                        disabled={u.role === "admin" || u.id === currentUser?.id}
                        onClick={() => deleteUser(u.id, u.role)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
