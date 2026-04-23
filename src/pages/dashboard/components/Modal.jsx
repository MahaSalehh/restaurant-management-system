export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        <div className="d-flex justify-content-between mb-3">
          <h5>{title}</h5>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            ✕
          </button>
        </div>

        {children}

      </div>
    </div>
  );
}