function AdminConfirmModal({ title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="admin-modal-body">
          <p>{message}</p>
        </div>
        <div className="admin-modal-footer">
          <button type="button" className="admin-btn secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="admin-btn danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default AdminConfirmModal;
