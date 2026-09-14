export default function StatusBadge({ children, tone }) {
  const value = tone || String(children).toLowerCase().replaceAll(" ", "-");
  return <span className={`badge badge-${value}`}>{children}</span>;
}
