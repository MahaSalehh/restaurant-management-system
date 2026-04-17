function StatusBadge({ status = "" }) {
  const getColor = (value) => {
    switch (value) {
      case "pending":
        return "#f59e0b"; // nicer warning
      case "accepted":
        return "#22c55e"; // cleaner green
      case "rejected":
        return "#ef4444"; // red
      case "delivered":
        return "#0ea5e9"; // blue
      case "in_progress":
        return "#8b5cf6"; // purple
      default:
        return "#9ca3af"; // gray
    }
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        backgroundColor: getColor(status),
        color: "white",
        fontSize: "12px",
        fontWeight: 500,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {status?.replaceAll("_", " ")}
    </span>
  );
}

export default StatusBadge;