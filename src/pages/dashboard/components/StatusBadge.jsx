import React from "react";

function StatusBadge({ status = "pending" }) {
  const getClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "active":
      case "delivered":
        return "status-badge success";

      case "pending":
      case "in_progress":
        return "status-badge warning";

      case "rejected":
      case "deleted":
        return "status-badge danger";

      default:
        return "status-badge info";
    }
  };

  return (
    <span className={getClass(status)}>
      {status}
    </span>
  );
}

export default StatusBadge;