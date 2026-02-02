import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminPageHeader from "./AdminPageHeader";
import AdminMessageModal from "./AdminMessageModal";
import AdminConfirmModal from "./AdminConfirmModal";
import AdminPagination from "./AdminPagination";
import "./AdminProducts.css";

const LIMIT = 10;

function getImageBase() {
  const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return url.replace(/\/api\/?$/, "");
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageModal, setMessageModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: 0,
    isActive: true,
    isPromotional: false,
  });

  const fetchProducts = () => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search.trim()) params.search = search.trim();
    if (statusFilter === "active") params.status = "active";
    if (statusFilter === "inactive") params.status = "inactive";
    API.get("/admin/products", { params })
      .then((res) => {
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
        setTotal(res.data?.total ?? 0);
        setTotalPages(res.data?.totalPages ?? 1);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      brand: "",
      stock: 0,
      isActive: true,
      isPromotional: false,
    });
    setEditProduct(null);
    setShowAddForm(false);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setFormData({
      name: p.name || "",
      price: p.price ?? "",
      description: p.description || "",
      category: p.category || "",
      brand: p.brand || "",
      stock: p.stock ?? 0,
      isActive: p.isActive !== false,
      isPromotional: p.isPromotional === true,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price) || 0,
      description: formData.description.trim() || null,
      category: formData.category.trim() || null,
      brand: formData.brand.trim() || null,
      stock: parseInt(formData.stock, 10) || 0,
      isActive: formData.isActive,
      isPromotional: formData.isPromotional,
    };
    if (editProduct) {
      API.put(`/products/${editProduct.id}`, payload)
        .then(() => {
          resetForm();
          fetchProducts();
        })
        .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Update failed" }));
    } else {
      API.post("/products", payload)
        .then(() => {
          resetForm();
          fetchProducts();
        })
        .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Create failed" }));
    }
  };

  const handleDelete = (p) => {
    setConfirmModal({
      title: "Delete product",
      message: `Delete "${p.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setConfirmModal(null);
        API.delete(`/products/${p.id}`)
          .then(() => fetchProducts())
          .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Delete failed" }));
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  const imageUrl = (p) => {
    if (!p.image) return null;
    if (p.image.startsWith("http")) return p.image;
    const base = getImageBase();
    return p.image.startsWith("/") ? base + p.image : base + "/uploads/" + p.image;
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-products">
        <div className="admin-content">
          <div className="admin-loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <AdminPageHeader>
        <form className="admin-products-filters" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search name or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="admin-btn primary">Search</button>
        </form>
        <button type="button" className="admin-btn primary" onClick={() => { resetForm(); setShowAddForm(true); }}>
          Add product
        </button>
      </AdminPageHeader>
      <div className="admin-content">
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
        {(showAddForm || editProduct) && (
          <div className="admin-modal-overlay" onClick={resetForm}>
            <div className="admin-modal admin-product-form-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>{editProduct ? "Edit product" : "Add product"}</h3>
                <button type="button" className="admin-modal-close" onClick={resetForm} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="admin-modal-body" onSubmit={handleSave}>
                <div className="admin-form-row">
                  <label>Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="admin-form-row">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="admin-form-row">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="admin-form-row two-cols">
                  <div>
                    <label>Category</label>
                    <input
                      value={formData.category}
                      onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label>Brand</label>
                    <input
                      value={formData.brand}
                      onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="admin-form-row">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))}
                  />
                </div>
                <div className="admin-form-row checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((f) => ({ ...f, isActive: e.target.checked }))}
                    />
                    Active
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isPromotional}
                      onChange={(e) => setFormData((f) => ({ ...f, isPromotional: e.target.checked }))}
                    />
                    Promotional
                  </label>
                </div>
                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn secondary" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="admin-btn primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="admin-table-wrap">
          {products.length === 0 ? (
            <div className="admin-empty">No products found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {imageUrl(p) ? (
                        <img src={imageUrl(p)} alt="" className="admin-product-thumb" />
                      ) : (
                        <span className="admin-product-no-img">—</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>₹{Number(p.price).toLocaleString()}</td>
                    <td>{p.category || "—"}</td>
                    <td>{p.brand || "—"}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`admin-status-badge ${p.isActive ? "active" : "inactive"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="admin-btn small secondary" onClick={() => openEdit(p)}>Edit</button>
                      <button type="button" className="admin-btn small danger" onClick={() => handleDelete(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {total > 0 && (
          <p className="admin-pagination-summary" style={{ marginTop: 16, marginBottom: 0 }}>
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} products
          </p>
        )}
        {totalPages > 1 && (
          <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
