const axios = require('axios');

function computeStats(values) {
  const count = values.length;
  if (!count) {
    return { count: 0, mean: 0, std: 0 };
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count;
  const std = Math.sqrt(variance);
  return { count, mean, std };
}

function localAnomalyScore(amount, historySummary) {
  if (!historySummary || historySummary.count < 1 || historySummary.std === 0) {
    return { zScore: 0, anomalySeverity: 'NONE', source: 'local' };
  }
  const zScore = (amount - historySummary.mean) / historySummary.std;
  let anomalySeverity = 'LOW';
  if (zScore > 3) {
    anomalySeverity = 'HIGH';
  } else if (zScore > 2) {
    anomalySeverity = 'MEDIUM';
  }
  return { zScore, anomalySeverity, source: 'local' };
}

async function scoreWithAzureML(payload) {
  const endpoint = process.env.AML_ENDPOINT_URL;
  const apiKey = process.env.AML_API_KEY;

  if (!endpoint || !apiKey) {
    return null;
  }

  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
}

async function scoreAnomaly({ vendorName, amount, historySummary }) {
  const payload = {
    vendorName,
    amount,
    vendorHistorySummary: historySummary,
  };

  try {
    const amlResponse = await scoreWithAzureML(payload);
    if (amlResponse && typeof amlResponse.zScore === 'number') {
      return {
        zScore: amlResponse.zScore,
        anomalySeverity: amlResponse.anomalySeverity || 'LOW',
        source: 'azureml',
      };
    }
  } catch (error) {
    return {
      ...localAnomalyScore(amount, historySummary),
      source: 'local-fallback',
    };
  }

  return localAnomalyScore(amount, historySummary);
}

module.exports = {
  computeStats,
  scoreAnomaly,
};
