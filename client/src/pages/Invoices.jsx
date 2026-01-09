import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import api from '../lib/api';
import InvoiceTable from '../components/InvoiceTable';
import './Invoices.css';
const riskOptions = [
  { label: 'All Risks', value: '' },
  { label: '🔴 High Risk', value: 'HIGH' },
  { label: '🟡 Medium Risk', value: 'MEDIUM' },
  { label: '🟢 Low Risk', value: 'LOW' },
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
      setError('System could not retrieve invoice data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInvoices();
    }, 300); // Debounce search for better UX
    return () => clearTimeout(delayDebounceFn);
  }, [risk, search]);

  const handleExport = async () => {
    try {
      const response = await api.get('/api/invoices/export.csv', {
        params: { risk: 'MEDIUM,HIGH' },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `IFW-Risk-Report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Export failed. Please try again.');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ Permanent Action: Delete all records from Azure CosmosDB?')) return;
    try {
      await api.delete('/api/invoices');
      fetchInvoices();
    } catch (err) {
      setError('Delete operation failed.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="invoices-page"
    >
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div className="header-titles">
          <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }}>Audit Risk Ledger</motion.h1>
          <p>Real-time oversight of financial anomalies detected by Azure AI.</p>
        </div>
        <div className="header-actions">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="btn-export" 
            onClick={handleExport}
          >
            📥 Export CSV
          </motion.button>
          <button className="btn-danger-outline" onClick={handleDeleteAll}>
            Purge All
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="filter-bar-card">
        <div className="filter-inputs">
          <div className="input-group">
            <span className="input-icon">🔍</span>
            <input
              type="search"
              placeholder="Search vendor, ID, or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="select-group">
            <select value={risk} onChange={(e) => setRisk(e.target.value)}>
              {riskOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="stats-mini">
          <span className="stat-pill">Total: <b>{invoices.length}</b></span>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-container">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="loading-shimmer"
            >
              <div className="spinner"></div>
              <p>Synchronizing with Azure Intelligence...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="error-alert"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {invoices.length > 0 ? (
                <InvoiceTable invoices={invoices} />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📂</div>
                  <h3>No Invoices Found</h3>
                  <p>Adjust your filters or upload a new document to start auditing.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}