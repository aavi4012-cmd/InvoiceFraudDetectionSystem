import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import FieldConfidence from '../components/FieldConfidence';
import RiskBadge from '../components/RiskBadge';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/api/invoices/${id}`);
        setInvoice(response.data?.invoice);
      } catch (err) {
        setError('Failed to load invoice.');
      }
    };
    fetchInvoice();
  }, [id]);

  if (error) {
    return <div className="page">{error}</div>;
  }

  if (!invoice) {
    return <div className="page muted">Loading invoice...</div>;
  }

  const fields = invoice.extracted || {};
  const confidence = invoice.confidence || {};

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Invoice Detail</h1>
          <p>{invoice.fileName}</p>
        </div>
        <div className="header-actions">
          <Link className="secondary" to="/invoices">
            Back to list
          </Link>
          {invoice.fileUrl && (
            <a className="primary" href={invoice.fileUrl} target="_blank" rel="noreferrer">
              Download File
            </a>
          )}
        </div>
      </header>

      <section className="card">
        <div className="summary-grid">
          <div>
            <h2>Risk Summary</h2>
            <div className="risk-summary">
              <RiskBadge level={invoice.risk?.level} />
              <div>
                <p className="muted">Score: {invoice.risk?.score ?? 0}</p>
                <p className="muted">Action: {invoice.risk?.action}</p>
              </div>
            </div>
          </div>
          <div>
            <h2>Extraction</h2>
            <p className="muted">
              Status: {invoice.extractionStatus}
              {invoice.extractionStatus === 'FAILED' && invoice.extractionError
                ? ` (${invoice.extractionError})`
                : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Extracted Fields</h2>
        <div className="fields-grid">
          <FieldConfidence
            label="Vendor"
            value={fields.vendorName}
            confidence={confidence.vendorName}
          />
          <FieldConfidence label="GSTIN" value={fields.gstin} confidence={confidence.gstin} />
          <FieldConfidence
            label="Invoice Number"
            value={fields.invoiceNumber}
            confidence={confidence.invoiceNumber}
          />
          <FieldConfidence
            label="Invoice Date"
            value={fields.invoiceDate ? new Date(fields.invoiceDate).toLocaleDateString() : '--'}
            confidence={confidence.invoiceDate}
          />
          <FieldConfidence
            label="Total Amount"
            value={
              fields.totalAmount !== undefined && fields.totalAmount !== null
                ? `${fields.currency || ''} ${fields.totalAmount.toFixed(2)}`.trim()
                : '--'
            }
            confidence={confidence.totalAmount}
          />
          <FieldConfidence
            label="Total Tax"
            value={
              fields.totalTax !== undefined && fields.totalTax !== null
                ? `${fields.currency || ''} ${fields.totalTax.toFixed(2)}`.trim()
                : '--'
            }
            confidence={confidence.totalTax}
          />
          <FieldConfidence
            label="Currency"
            value={fields.currency}
            confidence={confidence.currency}
          />
        </div>
      </section>

      <section className="card">
        <h2>Signals</h2>
        {invoice.signals && invoice.signals.length > 0 ? (
          <div className="signals">
            {invoice.signals.map((signal, index) => (
              <div key={`${signal.code}-${index}`} className="signal">
                <div className="signal-header">
                  <span className={`signal-severity ${signal.severity.toLowerCase()}`}>
                    {signal.severity}
                  </span>
                  <strong>{signal.code}</strong>
                </div>
                <p>{signal.reason}</p>
                {signal.evidence && (
                  <pre>{JSON.stringify(signal.evidence, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No signals were triggered.</p>
        )}
      </section>

      <section className="card">
        <h2>Auditor Explanation</h2>
        <p>{invoice.explanation || 'No explanation available.'}</p>
      </section>
    </div>
  );
}
