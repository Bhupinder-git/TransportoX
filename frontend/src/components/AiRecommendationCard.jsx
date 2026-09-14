export default function AiRecommendationCard({ compact = false }) {
  return (
    <div className={`ai-card ${compact ? "compact" : ""}`}>
      <div className="ai-head">
        <span className="ai-orb">✦</span>
        <div>
          <div className="eyebrow purple-text">LOGISTICS AI AGENT</div>
          <strong>Recovery recommendation</strong>
        </div>
        <span className="confidence">92% CONFIDENCE</span>
      </div>
      <p>
        Transfer critical cargo from <b>TX-008</b> to nearby support vehicle{" "}
        <b>TX-024</b>. This protects the MediCore delivery window with only 12
        minutes of ETA variance.
      </p>
      <div className="ai-meta">
        <span>
          Risk: <b className="success-text">LOW</b>
        </span>
        <span>
          Impact: <b>−₹15,499 estimated cost</b>
        </span>
      </div>
      <button className="button purple-button">Review recommendation →</button>
    </div>
  );
}
