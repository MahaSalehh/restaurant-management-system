function CrudModal({
  show,
  onHide,
  title,
  formData,
  setFormData,
  onSubmit,
  fields = [],
  loading,
}) {

  if (!show) return null;

  const handleChange = (e, field) => {
    const { name, value, files } = e.target;

    if (field?.type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-3">

        <h4>{title}</h4>

        {fields.map((f) => (
          <div className="mb-2" key={f.name}>

            <label>{f.label}</label>

            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(e, f)}
                className="form-control"
              />
            ) : f.type === "file" ? (
              <input
                type="file"
                name={f.name}
                onChange={(e) => handleChange(e, f)}
                className="form-control"
              />
            ) : f.type === "select" ? (
              <select
                name={f.name}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(e, f)}
                className="form-control"
              >
                <option value="">Select</option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type || "text"}
                name={f.name}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(e, f)}
                className="form-control"
              />
            )}

          </div>
        ))}

        <button
          className="btn btn-dark w-100"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Save"}
        </button>

        <button className="btn btn-light w-100 mt-2" onClick={onHide}>
          Cancel
        </button>

      </div>
    </div>
  );
}

export default CrudModal;