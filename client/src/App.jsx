import { NavLink, Route, Routes } from 'react-router-dom';
import Upload from './pages/Upload';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">IFW</span>
          <span className="brand-title">Invoice Fraud Watch</span>
        </div>
        <div className="nav-links">
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
            Upload
          </NavLink>
          <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active' : '')}>
            Risk List
          </NavLink>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
        </Routes>
      </main>
    </div>
  );
}
