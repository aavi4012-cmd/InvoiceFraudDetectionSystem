const Invoice = require('../models/Invoice');
const { normalizeVendorName, normalizeInvoiceNumber } = require('../utils/normalize');
const { isValidGstin } = require('../utils/gstin');
const { computeStats, scoreAnomaly } = require('./anomalyScoring');

const severityRank = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  INFO: 0,
};

function buildSignal(code, severity, reason, evidence) {
  return { code, severity, reason, evidence };
}

function computeRisk(signals) {
  if (!signals || signals.length === 0) {
    return {
      level: 'LOW',
      score: 0,
      topReasons: [],
      action: 'PROCEED',
    };
  }

  const highest = signals.reduce((max, signal) => {
    const rank = severityRank[signal.severity] ?? 0;
    return rank > max ? rank : max;
  }, 0);

  const level = highest >= 3 ? 'HIGH' : highest === 2 ? 'MEDIUM' : 'LOW';
  const action = level === 'HIGH' ? 'BLOCK' : level === 'MEDIUM' ? 'HOLD' : 'PROCEED';

  const score = Math.min(
    100,
    signals.reduce((sum, signal) => {
      if (signal.severity === 'HIGH') return sum + 35;
      if (signal.severity === 'MEDIUM') return sum + 20;
      if (signal.severity === 'LOW') return sum + 10;
      return sum + 5;
    }, 0)
  );

  const topReasons = [...signals]
    .sort((a, b) => (severityRank[b.severity] ?? 0) - (severityRank[a.severity] ?? 0))
    .slice(0, 2)
    .map((signal) => signal.reason);

  return { level, score, topReasons, action };
}

async function computeSignals({ extracted, excludeId }) {
  const signals = [];
  const vendorName = extracted.vendorName || null;
  const invoiceNumber = extracted.invoiceNumber || null;
  const parsedDate = extracted.invoiceDate ? new Date(extracted.invoiceDate) : null;
  const invoiceDate =
    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
  let totalAmount = null;
  if (typeof extracted.totalAmount === 'number') {
    totalAmount = extracted.totalAmount;
  } else if (typeof extracted.totalAmount === 'string') {
    const parsedAmount = Number(extracted.totalAmount);
    totalAmount = Number.isNaN(parsedAmount) ? null : parsedAmount;
  }
  const gstin = extracted.gstin || null;

  if (!invoiceNumber) {
    signals.push(buildSignal('MISSING_INVOICE_NUMBER', 'MEDIUM', 'Invoice number is missing.', {}));
  }
  if (!invoiceDate) {
    signals.push(buildSignal('MISSING_INVOICE_DATE', 'MEDIUM', 'Invoice date is missing.', {}));
  }
  if (!vendorName) {
    signals.push(buildSignal('MISSING_VENDOR_NAME', 'MEDIUM', 'Vendor name is missing.', {}));
  }

  if (vendorName) {
    if (gstin) {
      if (!isValidGstin(gstin)) {
        signals.push(buildSignal('GSTIN_INVALID', 'HIGH', 'GSTIN format is invalid.', { gstin }));
      }
    } else {
      signals.push(buildSignal('GSTIN_MISSING', 'MEDIUM', 'GSTIN is missing for the vendor.', {}));
    }
  }

  const normalizedVendor = normalizeVendorName(vendorName);
  const normalizedInvoice = normalizeInvoiceNumber(invoiceNumber);

  if (normalizedVendor && normalizedInvoice) {
    const duplicate = await Invoice.findOne({
      deleted: { $ne: true },
      'normalized.vendorName': normalizedVendor,
      'normalized.invoiceNumber': normalizedInvoice,
      _id: { $ne: excludeId },
    });

    if (duplicate) {
      signals.push(
        buildSignal('DUPLICATE_EXACT', 'HIGH', 'Exact duplicate invoice detected.', {
          duplicateId: duplicate._id,
        })
      );
    }
  }

  if (normalizedVendor && invoiceDate && totalAmount !== null) {
    const start = new Date(invoiceDate);
    start.setDate(start.getDate() - 7);
    const end = new Date(invoiceDate);
    end.setDate(end.getDate() + 7);

    const nearbyInvoices = await Invoice.find({
      deleted: { $ne: true },
      'normalized.vendorName': normalizedVendor,
      'extracted.invoiceDate': { $gte: start, $lte: end },
      _id: { $ne: excludeId },
    });

    const nearDuplicate = nearbyInvoices.find((invoice) => {
      const amount = invoice.extracted?.totalAmount;
      if (typeof amount !== 'number') {
        return false;
      }
      const diff = Math.abs(totalAmount - amount);
      const threshold = totalAmount * 0.02;
      return diff <= threshold;
    });

    if (nearDuplicate) {
      signals.push(
        buildSignal('DUPLICATE_NEAR', 'MEDIUM', 'Near-duplicate invoice detected.', {
          similarInvoiceId: nearDuplicate._id,
        })
      );
    }
  }

  if (normalizedVendor && totalAmount !== null) {
    const history = await Invoice.find({
      deleted: { $ne: true },
      'normalized.vendorName': normalizedVendor,
      'extracted.totalAmount': { $ne: null },
      _id: { $ne: excludeId },
    });

    const values = history
      .map((invoice) => invoice.extracted?.totalAmount)
      .filter((amount) => typeof amount === 'number');

    if (values.length < 3) {
      signals.push(
        buildSignal('NOT_ENOUGH_HISTORY', 'INFO', 'Not enough vendor history for anomaly scoring.', {
          count: values.length,
        })
      );
    } else {
      const stats = computeStats(values);
      const anomaly = await scoreAnomaly({
        vendorName: normalizedVendor,
        amount: totalAmount,
        historySummary: stats,
      });

      if (anomaly.anomalySeverity === 'HIGH') {
        signals.push(
          buildSignal('AMOUNT_ANOMALY', 'HIGH', 'Invoice amount is a high anomaly for this vendor.', {
            zScore: anomaly.zScore,
            mean: stats.mean,
            std: stats.std,
            source: anomaly.source,
          })
        );
      } else if (anomaly.anomalySeverity === 'MEDIUM') {
        signals.push(
          buildSignal('AMOUNT_ANOMALY', 'MEDIUM', 'Invoice amount is above typical vendor range.', {
            zScore: anomaly.zScore,
            mean: stats.mean,
            std: stats.std,
            source: anomaly.source,
          })
        );
      }
    }
  }

  return { signals, normalized: { vendorName: normalizedVendor, invoiceNumber: normalizedInvoice } };
}

module.exports = {
  computeSignals,
  computeRisk,
};
