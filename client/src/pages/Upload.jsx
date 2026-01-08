import { useState } from 'react';
import { Link } from 'react-router-dom';
import Uploader from '../components/Uploader';
import RiskBadge from '../components/RiskBadge';

export default function Upload() {
  const [uploaded, setUploaded] = useState([]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Invoice Fraud Watch</h1>
          <p>Upload invoices and get instant risk signals before you approve payments.</p>
        </div>
        <Link className="secondary" to="/invoices">
          View Risk List
        </Link>
      </header>

      <Uploader onUploadComplete={setUploaded} />

      {uploaded.length > 0 && (
        <section className="card">
          <h2>Latest Analysis</h2>
          <div className="analysis-grid">
            {uploaded.map((invoice) => (
              <div key={invoice._id} className="analysis-item">
                <div className="analysis-title">{invoice.fileName}</div>
                <div className="analysis-meta">
                  <span>{invoice.extracted?.vendorName || 'Unknown vendor'}</span>
                  <RiskBadge level={invoice.risk?.level} />
                </div>
                <p className="muted">{invoice.risk?.topReasons?.join(' / ') || 'No red flags found.'}</p>
                <Link to={`/invoices/${invoice._id}`} className="link">
                  View details
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
