const fs = require('fs');
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');

function readString(field) {
  if (!field) {
    return null;
  }
  return field.valueString || field.content || null;
}

function readDate(field) {
  if (!field) {
    return null;
  }
  const value = field.valueDate || field.valueString || field.content || null;
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readNumber(field) {
  if (!field) {
    return null;
  }
  if (typeof field.valueNumber === 'number') {
    return field.valueNumber;
  }
  if (field.valueCurrency && typeof field.valueCurrency.amount === 'number') {
    return field.valueCurrency.amount;
  }
  return null;
}

function readCurrency(field) {
  if (!field) {
    return null;
  }
  if (field.valueCurrency && field.valueCurrency.currency) {
    return field.valueCurrency.currency;
  }
  return null;
}

function mapInvoiceFields(doc) {
  const fields = doc.fields || {};

  const invoiceNumberField = fields.InvoiceId;
  const vendorNameField = fields.VendorName;
  const gstinField = fields.VendorTaxId || fields.CustomerTaxId;
  const invoiceDateField = fields.InvoiceDate;
  const totalField = fields.AmountDue || fields.Total;
  const totalTaxField = fields.TotalTax || fields.Tax;

  const extracted = {
    vendorName: readString(vendorNameField),
    gstin: readString(gstinField),
    invoiceNumber: readString(invoiceNumberField),
    invoiceDate: readDate(invoiceDateField),
    totalAmount: readNumber(totalField),
    totalTax: readNumber(totalTaxField),
    currency: readCurrency(totalField) || readCurrency(fields.Total) || readCurrency(fields.AmountDue),
  };

  const confidence = {
    vendorName: vendorNameField?.confidence ?? null,
    gstin: gstinField?.confidence ?? null,
    invoiceNumber: invoiceNumberField?.confidence ?? null,
    invoiceDate: invoiceDateField?.confidence ?? null,
    totalAmount: totalField?.confidence ?? null,
    totalTax: totalTaxField?.confidence ?? null,
    currency: totalField?.confidence ?? null,
  };

  return { extracted, confidence };
}

async function extractInvoiceFromFile(filePath) {
  const endpoint = process.env.AZURE_DI_ENDPOINT;
  const key = process.env.AZURE_DI_KEY;

  if (!endpoint || !key) {
    throw new Error('Azure Document Intelligence is not configured.');
  }

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  const fileBuffer = fs.readFileSync(filePath);
  const poller = await client.beginAnalyzeDocument('prebuilt-invoice', fileBuffer);
  const result = await poller.pollUntilDone();
  const document = result.documents && result.documents[0];

  if (!document) {
    throw new Error('No invoice document detected.');
  }

  return mapInvoiceFields(document);
}

module.exports = {
  extractInvoiceFromFile,
};
