const express = require('express');
const cors = require('cors');
const path = require('path');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/invoices', invoiceRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error.' });
});

module.exports = app;
