'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Landing.css';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Landing = () => {
  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <header className="hero-section">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="azure-badge">
            <span style={{ fontSize: '1.2rem' }}>☁️</span> Built on Microsoft Azure
          </motion.div>
          
          <motion.h1 variants={fadeInUp}>
            Secure Every Transaction with <br />
            <span className="text-gradient">Cloud Intelligence.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="hero-subtitle">
            Using Azure AI Document Intelligence to safeguard global commerce 
            from invoice fraud and billing anomalies.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="header-actions">
            <Link to="/upload" className="primary-btn">Launch Auditor</Link>
            <Link to="/invoices" className="secondary-btn">Project Documentation</Link>
          </motion.div>
        </motion.div>
      </header>

      {/* TRUSTED BY - Now a clean "Logo Cloud" */}
<section className="trusted-by">
  <div className="container">
    <p className="label">Empowering the future of FinTech</p>
    <div className="logo-cloud">
      <span>IMAGINE CUP <b>2026</b></span>
      <div className="divider-v"></div>
      <span>MICROSOFT <b>AI</b></span>
      <div className="divider-v"></div>
      <span>AZURE <b>CLOUD</b></span>
      <div className="divider-v"></div>
      <span>FIN-SEC <b>LABS</b></span>
    </div>
  </div>
</section>

{/* IMPACT SECTION - Cleaned Grid */}
<section className="impact-section">
  <div className="section-header-mini">
    <span className="badge-outline">IMPACT</span>
    <h2>Driving Global Change</h2>
  </div>
  
  <div className="impact-grid">
    <motion.div whileHover={{ y: -5 }} className="impact-card-main">
      <div className="impact-icon">📈</div>
      <div className="impact-content">
        <span className="tag">GOAL</span>
        <h3>Economic Growth</h3>
        <p>By reducing the $40B lost annually to invoice fraud, IFW stabilizes small business cash flow and prevents capital leakage.</p>
      </div>
    </motion.div>

    <div className="impact-secondary-grid">
      <motion.div whileHover={{ y: -5 }} className="impact-card-sub">
        <div className="impact-icon-small">🛡️</div>
        <div>
          <h4>Responsible AI</h4>
          <p>Built using Microsoft's principles to ensure unbiased risk assessments.</p>
        </div>
      </motion.div>

      <motion.div whileHover={{ y: -5 }} className="impact-card-sub">
        <div className="impact-icon-small">🌍</div>
        <div>
          <h4>Global Scale</h4>
          <p>Deployable across 60+ Azure regions for local data residency.</p>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* STATS BAR - High Contrast Dark Mode */}
      <section className="stats-bar">
        <motion.div 
          className="stats-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { label: "Annual Global Fraud Loss", value: "$40B+" },
            { label: "Azure AI Accuracy", value: "99.9%" },
            { label: "Real-time Detection", value: "< 2s" },
            { label: "Compliance Ready", value: "SOC2" }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="stat-item">
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AZURE TECH STACK - Restored & Polished */}
<section className="tech-stack">
  <div className="container">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="section-header-centered"
    >
      <span className="badge-outline">Infrastructure</span>
      <h2>Azure-Native Architecture</h2>
      <p>Leveraging the Microsoft ecosystem for enterprise-grade security and 99.9% uptime.</p>
    </motion.div>

    <motion.div 
      className="tech-grid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {/* CARD 1: AI */}
      <motion.div variants={fadeInUp} className="tech-card">
        <div className="tech-icon-wrapper">🧠</div>
        <div className="tech-info">
          <h4>AI Services</h4>
          <h3>Document Intelligence</h3>
          <p>Advanced machine learning to extract key-value pairs from complex invoices.</p>
        </div>
      </motion.div>

      {/* CARD 2: COMPUTE */}
      <motion.div variants={fadeInUp} className="tech-card">
        <div className="tech-icon-wrapper">⚡</div>
        <div className="tech-info">
          <h4>Compute</h4>
          <h3>Azure Functions</h3>
          <p>Event-driven serverless architecture for real-time audit processing.</p>
        </div>
      </motion.div>

      {/* CARD 3: DATABASE */}
      <motion.div variants={fadeInUp} className="tech-card">
        <div className="tech-icon-wrapper">💾</div>
        <div className="tech-info">
          <h4>Database</h4>
          <h3>Cosmos DB</h3>
          <p>Global distributed NoSQL database for ultra-low latency data retrieval.</p>
        </div>
      </motion.div>

      {/* CARD 4: STORAGE */}
      <motion.div variants={fadeInUp} className="tech-card">
        <div className="tech-icon-wrapper">📦</div>
        <div className="tech-info">
          <h4>Storage</h4>
          <h3>Blob Storage</h3>
          <p>Highly scalable object storage with automated lifecycle management.</p>
        </div>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* THE AUDIT WORKFLOW - With Visual Connectors */}
      <section className="workflow-section">
        <div className="section-header-centered">
          <span className="badge-outline">PROCESS</span>
          <h2>The Audit Workflow</h2>
        </div>
        
        <motion.div 
          className="workflow-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { id: "01", title: "Blob Ingestion", desc: "Securely upload invoices directly to Azure Blob Storage with AES-256 encryption." },
            { id: "02", title: "Cognitive Analysis", desc: "Azure AI models extract 30+ fields and check for structural document tampering." },
            { id: "03", title: "Real-time Alerting", desc: "Instant risk scoring and alerts via Azure Communication Services." }
          ].map((step, i) => (
            <motion.div key={i} variants={fadeInUp} className="workflow-card">
              <div className="workflow-number">{step.id}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < 2 && <div className="workflow-connector"></div>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* IMPACT SECTION - Professional Layout */}
      <section className="impact-section">
        <div className="impact-container">
          <motion.div 
            className="impact-main-card"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
          >
            <div className="tag-premium">CORE GOAL</div>
            <h3>Economic Growth</h3>
            <p>By reducing the $40B lost annually to invoice fraud, IFW stabilizes small business cash flow and prevents financial leakage in global supply chains.</p>
            <div className="impact-stat-mini">$40B+ Protected</div>
          </motion.div>

          <div className="impact-side-grid">
            <motion.div whileHover={{ y: -5 }} className="impact-sub-card">
              <div className="icon-circle">🤖</div>
              <h4>Responsible AI</h4>
              <p>Built using Microsoft's principles to ensure unbiased risk assessments.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="impact-sub-card">
              <div className="icon-circle">🌐</div>
              <h4>Global Scale</h4>
              <p>Deployable across 60+ Azure regions for local data residency compliance.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Mesh Gradient Style */}
      <section className="cta-wrapper">
        <motion.div 
          className="cta-glass-box"
          whileInView={{ scale: [0.95, 1], opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <h2>Innovation for a Secure Future</h2>
          <p>Join us in redefining financial integrity with Microsoft AI.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/upload" className="cta-btn-primary">Launch Live Demo</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER - Professional Renamed Classes */}
      <footer className="footer-site-global">
        <div className="footer-main-content">
          <div className="footer-brand-area">
            <div className="footer-logo-text">IFW <span>AUDITOR</span></div>
            <p>Enterprise-grade invoice auditing powered by Azure AI Intelligence.</p>
            <div className="footer-social-placeholders">
              <div className="social-dot"></div>
              <div className="social-dot"></div>
              <div className="social-dot"></div>
            </div>
          </div>
          
          <div className="footer-nav-group">
            <div className="footer-nav-col">
              <h5>Platform</h5>
              <Link to="/upload">Live Demo</Link>
              <Link to="/invoices">Documentation</Link>
              <a href="#azure">Architecture</a>
            </div>
            <div className="footer-nav-col">
              <h5>Imagine Cup</h5>
              <span className="footer-info-text">2026 Submission</span>
              <span className="footer-info-text">Financial Security</span>
            </div>
          </div>
        </div>

        <div className="footer-legal-bar">
          <div className="legal-left">
            <span>© 2026 IFW Auditor Team</span>
            <span className="separator">|</span>
            <span>Built for Microsoft Imagine Cup</span>
          </div>
          <div className="legal-right">
            <span>Powered by <b>Azure & OpenAI</b></span>
          </div>
        </div>
      </footer>
      </div>
  );
};

export default Landing;