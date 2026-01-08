const path = require('path');
const fs = require('fs/promises');
const Invoice = require('../models/Invoice');
const { extractInvoiceFromFile } = require('../services/azureDocumentIntelligence');
const { computeSignals, computeRisk } = require('../services/riskScoring');
const { generateExplanation } = require('../services/explanation');

function normalizeRiskLevel(value) {
  const upper = value.trim().toUpperCase();
  return upper === 'MED' ? 'MEDIUM' : upper;
}

function buildFileUrl(req, invoice) {
  const fileName = path.basename(invoice.filePath);
  return `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
}

function serializeInvoice(req, invoice) {
  const obj = invoice.toObject({ virtuals: false });
  return {
    ...obj,
    fileUrl: buildFileUrl(req, invoice),
  };
}

async function uploadInvoices(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const saved = [];

    for (const file of req.files) {
      const invoice = new Invoice({
        fileName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        extracted: {},
        confidence: {},
        signals: [],
        risk: { level: 'LOW', score: 0, topReasons: [], action: 'PROCEED' },
      });

      try {
        const { extracted, confidence } = await extractInvoiceFromFile(file.path);
        const { signals, normalized } = await computeSignals({ extracted });
        const risk = computeRisk(signals);
        const explanation = await generateExplanation({ extracted, signals, risk });

        invoice.extracted = extracted;
        invoice.confidence = confidence;
        invoice.signals = signals;
        invoice.risk = risk;
        invoice.explanation = explanation;
        invoice.normalized = normalized;
        invoice.extractionStatus = 'SUCCESS';
      } catch (error) {
        invoice.extractionStatus = 'FAILED';
        invoice.extractionError = error.message || 'Extraction failed.';
      }

      await invoice.save();
      saved.push(serializeInvoice(req, invoice));
    }

    return res.status(201).json({ invoices: saved });
  } catch (error) {
    return next(error);
  }
}

async function listInvoices(req, res, next) {
  try {
    const query = { deleted: { $ne: true } };
    const riskFilter = req.query.risk;
    const search = req.query.search;

    if (riskFilter) {
      const levels = riskFilter.split(',').map(normalizeRiskLevel);
      query['risk.level'] = { $in: levels };
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { 'extracted.vendorName': regex },
        { 'extracted.invoiceNumber': regex },
      ];
    }

    const invoices = await Invoice.find(query).sort({ uploadedAt: -1 });
    return res.json({ invoices: invoices.map((invoice) => serializeInvoice(req, invoice)) });
  } catch (error) {
    return next(error);
  }
}

async function getInvoiceById(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.deleted) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    return res.json({ invoice: serializeInvoice(req, invoice) });
  } catch (error) {
    return next(error);
  }
}

async function exportInvoicesCsv(req, res, next) {
  try {
    const riskFilter = req.query.risk;
    const query = { deleted: { $ne: true } };

    if (riskFilter) {
      const levels = riskFilter.split(',').map(normalizeRiskLevel);
      query['risk.level'] = { $in: levels };
    }

    const invoices = await Invoice.find(query).sort({ uploadedAt: -1 });
    const { stringify } = require('csv-stringify/sync');

    const records = invoices.map((invoice) => ({
      id: invoice._id.toString(),
      fileName: invoice.fileName,
      vendorName: invoice.extracted?.vendorName || '',
      invoiceNumber: invoice.extracted?.invoiceNumber || '',
      invoiceDate: invoice.extracted?.invoiceDate
        ? new Date(invoice.extracted.invoiceDate).toISOString().slice(0, 10)
        : '',
      totalAmount: invoice.extracted?.totalAmount ?? '',
      currency: invoice.extracted?.currency || '',
      riskLevel: invoice.risk?.level || 'LOW',
      riskScore: invoice.risk?.score ?? 0,
      topReasons: (invoice.risk?.topReasons || []).join(' | '),
    }));

    const csv = stringify(records, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="invoice-risk-report.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    return next(error);
  }
}

async function deleteAllInvoices(req, res, next) {
  try {
    const invoices = await Invoice.find({ deleted: { $ne: true } });

    await Promise.all(
      invoices.map(async (invoice) => {
        try {
          await fs.unlink(invoice.filePath);
        } catch (error) {
          // Ignore missing files.
        }
        invoice.deleted = true;
        await invoice.save();
      })
    );

    return res.json({ deleted: invoices.length });
  } catch (error) {
    return next(error);
  }
}

async function overrideInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.deleted) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const extracted = {
      ...invoice.extracted,
      ...req.body.extracted,
    };

    if (extracted.invoiceDate) {
      extracted.invoiceDate = new Date(extracted.invoiceDate);
    }

    const { signals, normalized } = await computeSignals({ extracted, excludeId: invoice._id });
    const risk = computeRisk(signals);
    const explanation = await generateExplanation({ extracted, signals, risk });

    invoice.extracted = extracted;
    invoice.normalized = normalized;
    invoice.signals = signals;
    invoice.risk = risk;
    invoice.explanation = explanation;
    await invoice.save();

    return res.json({ invoice: serializeInvoice(req, invoice) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  uploadInvoices,
  listInvoices,
  getInvoiceById,
  exportInvoicesCsv,
  deleteAllInvoices,
  overrideInvoice,
};
