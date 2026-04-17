export default function DataTable({ columns, children }) {
  return (
    <table className="dash-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}