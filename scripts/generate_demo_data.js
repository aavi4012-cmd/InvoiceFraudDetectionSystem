const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const FormData = require('form-data');

const API_URL = process.env.DEMO_API_URL || 'http://localhost:5000/api/invoices/upload';
const OUTPUT_DIR = path.join(__dirname, 'demo_files');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const invoices = [
  {
    fileName: 'nimbus-1001.pdf',
    vendorName: 'Nimbus Stationery',
    invoiceNumber: 'NS-1001',
    invoiceDate: '2024-12-01',
    gstin: '27ABCDE1234F1Z5',
    totalAmount: 10000,
    totalTax: 1800,
    currency: 'INR',
  },
  {
    fileName: 'nimbus-1001-duplicate.pdf',
    vendorName: 'Nimbus Stationery',
    invoiceNumber: 'NS-1001',
    invoiceDate: '2024-12-01',
    gstin: '27ABCDE1234F1Z5',
    totalAmount: 10000,
    totalTax: 1800,
    currency: 'INR',
  },
  {
    fileName: 'nimbus-1002-near.pdf',
    vendorName: 'Nimbus Stationery',
    invoiceNumber: 'NS-1002',
    invoiceDate: '2024-12-05',
    gstin: '27ABCDE1234F1Z5',
    totalAmount: 10150,
    totalTax: 1827,
    currency: 'INR',
  },
  {
    fileName: 'nimbus-2001-anomaly.pdf',
    vendorName: 'Nimbus Stationery',
    invoiceNumber: 'NS-2001',
    invoiceDate: '2024-12-20',
    gstin: '27ABCDE1234F1Z5',
    totalAmount: 30000,
    totalTax: 5400,
    currency: 'INR',
  },
  {
    fileName: 'bright-771-invalid-gstin.pdf',
    vendorName: 'Bright Metals',
    invoiceNumber: 'BM-771',
    invoiceDate: '2024-12-08',
    gstin: 'INVALIDGSTIN123',
    totalAmount: 15500,
    totalTax: 2790,
    currency: 'INR',
  },
  {
    fileName: 'orchid-7781-clean.pdf',
    vendorName: 'Orchid Logistics',
    invoiceNumber: 'OL-7781',
    invoiceDate: '2024-12-12',
    gstin: '29QWERT1234Z5Z9',
    totalAmount: 7800,
    totalTax: 1404,
    currency: 'INR',
  },
];

function createInvoicePdf(invoice) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, invoice.fileName);
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(18).text('Invoice', { align: 'left' });
    doc.moveDown();

    doc.fontSize(12).text(`Vendor Name: ${invoice.vendorName}`);
    doc.text(`GSTIN: ${invoice.gstin}`);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Invoice Date: ${invoice.invoiceDate}`);
    doc.text(`Currency: ${invoice.currency}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    doc.text('1. Consulting services - Quantity: 1 - Unit Price: ' + invoice.totalAmount);
    doc.moveDown();

    doc.text(`Total Tax: ${invoice.totalTax}`);
    doc.text(`Total Amount: ${invoice.totalAmount}`);

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

async function uploadInvoice(filePath) {
  const form = new FormData();
  form.append('files', fs.createReadStream(filePath));

  const response = await axios.post(API_URL, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
  });

  return response.data;
}

(async () => {
  console.log('Generating demo invoices...');
  for (const invoice of invoices) {
    const filePath = await createInvoicePdf(invoice);
    console.log(`Uploading ${invoice.fileName}...`);
    await uploadInvoice(filePath);
  }
  console.log('Demo data uploaded.');
})();
