function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '--';
  }
  return value;
}

export default function FieldConfidence({ label, value, confidence }) {
  const hasConfidence = typeof confidence === 'number';
  const percent = hasConfidence ? Math.round(confidence * 100) : null;

  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{displayValue(value)}</div>
      {hasConfidence && (
        <div className="confidence">
          <span>{percent}% confidence</span>
          <div className="confidence-bar">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
