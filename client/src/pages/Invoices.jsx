import { useEffect, useState } from 'react';
import api from '../lib/api';
import InvoiceTable from '../components/InvoiceTable';

const riskOptions = [
  { label: 'All', value: '' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [risk, setRisk] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (risk) params.risk = risk;
      if (search) params.search = search;
      const response = await api.get('/api/invoices', { params });
      setInvoices(response.data?.invoices || []);
    } catch (err) {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [risk, search]);

  const handleExport = async () => {
    try {
      const response = await api.get('/api/invoices/export.csv', {
        params: { risk: 'MEDIUM,HIGH' },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'invoice-risk-report.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export report.');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all invoices? This cannot be undone.')) return;
    try {
      await api.delete('/api/invoices');
      fetchInvoices();
    } catch (err) {
      setError('Failed to delete invoices.');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Risk List</h1>
          <p>Filter invoices by risk level or search by vendor/invoice number.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary" onClick={handleExport}>
            Export Report
          </button>
          <button type="button" className="danger" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="risk-select">Risk</label>
          <select id="risk-select" value={risk} onChange={(e) => setRisk(e.target.value)}>
            {riskOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Vendor or invoice number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className="ghost" onClick={fetchInvoices}>
          Refresh
        </button>
      </div>

      {loading && <div className="muted">Loading invoices...</div>}
      {error && <div className="alert">{error}</div>}

      <InvoiceTable invoices={invoices} />
    </div>
  );
}
