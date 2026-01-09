import React, { useState, useEffect } from 'react'; // Added missing imports
import { NavLink, Route, Routes } from 'react-router-dom';
import Upload from './pages/Upload';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Landing from './pages/Landing'; // Match the export name from Landing.jsx
import './App.css';
import { themes } from './theme'; 

export default function App() {
  // Initialize theme from localStorage or default to light
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const currentTheme = themes[themeName];
    const root = document.documentElement;

    // Apply CSS variables to the root element
    Object.keys(currentTheme).forEach((property) => {
      root.style.setProperty(property, currentTheme[property]);
    });

    // Save choice to localStorage
    localStorage.setItem('theme', themeName);
    
    // Optional: Update data-theme attribute for easier CSS targeting
    root.setAttribute('data-theme', themeName);
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <nav className="top-nav">
        <div className="nav-container">
          <div className="brand">
            <span className="brand-mark">IFW</span>
            <span className="brand-title">Invoice Fraud Watch</span>
          </div>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
              Upload
            </NavLink>
            <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active' : '')}>
              Risk List
            </NavLink>
            
            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {themeName === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main className="content-area">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
        </Routes>
      </main>
    </div>
  );
}