export default function FormField({ label, ...props }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label style={{ fontSize: "14px" }}>{label}</label>}

      <input
        {...props}
        className="form-control"
      />
    </div>
  );
}