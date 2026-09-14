export default function KpiCard({ label, value, detail, accent = "" }) {
  return (
    <div className={`kpi-card ${accent}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-detail">{detail}</div>
    </div>
  );
}
