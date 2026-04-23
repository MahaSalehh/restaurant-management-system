import ActionButtons from "./ActionButtons";

export default function CrudCard({
  title,
  subtitle,
  image,
  actions = [],
}) {
  return (
    <div className="card p-3 h-100 shadow-sm">

      {image && (
        <img
          src={image}
          className="rounded mb-2"
          style={{ height: "150px", objectFit: "cover" }}
        />
      )}

      <h6>{title}</h6>
      <small className="text-muted">{subtitle}</small>

      <div className="mt-3">
        <ActionButtons actions={actions} />
      </div>

    </div>
  );
}