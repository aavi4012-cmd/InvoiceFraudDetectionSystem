const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    severity: { type: String, enum: ['INFO', 'LOW', 'MEDIUM', 'HIGH'], required: true },
    reason: { type: String, required: true },
    evidence: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    extracted: {
      vendorName: { type: String },
      gstin: { type: String },
      invoiceNumber: { type: String },
      invoiceDate: { type: Date },
      totalAmount: { type: Number },
      totalTax: { type: Number },
      currency: { type: String },
    },
    confidence: {
      vendorName: { type: Number },
      gstin: { type: Number },
      invoiceNumber: { type: Number },
      invoiceDate: { type: Number },
      totalAmount: { type: Number },
      totalTax: { type: Number },
      currency: { type: Number },
    },
    normalized: {
      vendorName: { type: String },
      invoiceNumber: { type: String },
    },
    signals: [signalSchema],
    risk: {
      level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
      score: { type: Number, default: 0 },
      topReasons: [{ type: String }],
      action: { type: String, enum: ['PROCEED', 'HOLD', 'BLOCK'], default: 'PROCEED' },
    },
    explanation: { type: String },
    extractionStatus: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
    extractionError: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
