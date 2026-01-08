export default function RiskBadge({ level }) {
  const normalized = level || 'LOW';
  return <span className={`risk-badge risk-${normalized.toLowerCase()}`}>{normalized}</span>;
}
