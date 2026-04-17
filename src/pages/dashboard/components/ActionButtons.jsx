export default function ActionButtons({ actions = [] }) {
  return (
    <div className="d-flex gap-2 ">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`btn btn-sm btn-${action.variant}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}