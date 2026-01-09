import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Uploader from '../components/Uploader';
import RiskBadge from '../components/RiskBadge';
import './Upload.css';
// Variants for staggered list animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Upload() {
  const [uploaded, setUploaded] = useState([]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="upload-page"
    >
      <header className="upload-header">
        <div className="header-text">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            AI Invoice Auditor
          </motion.h1>
          <p>Deploying <b>Azure Document Intelligence</b> to intercept billing anomalies.</p>
        </div>
        <Link className="btn-secondary-outline" to="/invoices">
          📂 Review Risk Ledger
        </Link>
      </header>

      {/* UPLOADER CONTAINER */}
      <section className="uploader-wrapper">
        <Uploader onUploadComplete={setUploaded} />
      </section>

      {/* ANALYSIS RESULTS */}
      <AnimatePresence>
        {uploaded.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className="analysis-section"
          >
            <div className="analysis-header">
              <h2>Recent Intelligence Scan</h2>
              <span className="count-badge">{uploaded.length} Files</span>
            </div>

            <motion.div 
              className="analysis-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {uploaded.map((invoice) => (
                <motion.div 
                  key={invoice._id} 
                  variants={itemVariants}
                  className="analysis-card"
                  whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                >
                  <div className="card-top">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <div className="file-details">
                        <div className="analysis-title">{invoice.fileName}</div>
                        <div className="vendor-name">
                          {invoice.extracted?.vendorName || 'Unknown Vendor'}
                        </div>
                      </div>
                    </div>
                    <RiskBadge level={invoice.risk?.level} />
                  </div>

                  <div className="card-body">
                    <p className="risk-reasons">
                      {invoice.risk?.topReasons?.length > 0 
                        ? invoice.risk.topReasons.join(' • ') 
                        : 'Azure AI verified: No structural anomalies detected.'}
                    </p>
                  </div>

                  <div className="card-footer">
                    <Link to={`/invoices/${invoice._id}`} className="details-link">
                      Examine Data Points <span>→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}