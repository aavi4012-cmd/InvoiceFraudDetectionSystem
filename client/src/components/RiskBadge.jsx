import { motion } from 'framer-motion';

export default function RiskBadge({ level }) {
  const normalized = level?.toUpperCase() || 'LOW';
  
  const config = {
    HIGH: { label: 'High Risk', icon: '🚨' },
    MEDIUM: { label: 'Caution', icon: '⚠️' },
    LOW: { label: 'Verified', icon: '✅' },
  };

  const { label, icon } = config[normalized] || config.LOW;

  return (
    <motion.span 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`risk-pill risk-${normalized.toLowerCase()}`}
    >
      <span className="badge-icon">{icon}</span>
      {label}
    </motion.span>
  );
}