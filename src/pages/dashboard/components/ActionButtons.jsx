export default function ActionButtons({ actions = [] }) {
  if (!actions.length) return null;

  return (
    <div className="d-flex gap-2 flex-wrap">
      {actions.map((a, i) => (
        <button
          key={i}
          className={`btn btn-${a.variant || "secondary"} btn-sm`}
          onClick={a.onClick}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}