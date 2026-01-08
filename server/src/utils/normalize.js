function normalizeVendorName(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeInvoiceNumber(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  return value
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9\-\/]/g, '');
}

module.exports = {
  normalizeVendorName,
  normalizeInvoiceNumber,
};
