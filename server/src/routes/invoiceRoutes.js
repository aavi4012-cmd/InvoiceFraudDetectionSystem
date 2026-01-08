const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const suffix = crypto.randomBytes(6).toString('hex');
    cb(null, `${base}-${suffix}${ext}`);
  },
});

const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Unsupported file type. Only PDF/JPG/PNG are allowed.');
      error.status = 400;
      cb(error);
    }
  },
  limits: {
    files: 10,
    fileSize: 12 * 1024 * 1024,
  },
});

router.post('/upload', upload.array('files', 10), invoiceController.uploadInvoices);
router.get('/', invoiceController.listInvoices);
router.get('/export.csv', invoiceController.exportInvoicesCsv);
router.get('/:id', invoiceController.getInvoiceById);
router.delete('/', invoiceController.deleteAllInvoices);
router.post('/:id/override', invoiceController.overrideInvoice);

module.exports = router;
