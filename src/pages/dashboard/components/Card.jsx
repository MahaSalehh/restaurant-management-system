function CrudCard({ title, subtitle, image, onEdit, onDelete }) {
  return (
    <div className="card p-3 h-100">

      {image && (
        <img
          src={image}
          alt=""
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      )}

      <h5 className="mt-2">{title}</h5>
      <p className="text-muted">{subtitle}</p>

      <div className="d-flex gap-2 mt-auto">

        <button className="btn btn-light btn-sm" onClick={onEdit}>
          Edit
        </button>

        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>

      </div>

    </div>
  );
}

export default CrudCard;