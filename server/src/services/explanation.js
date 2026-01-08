const axios = require('axios');

function buildTemplateExplanation({ extracted, signals, risk }) {
  const vendor = extracted.vendorName || 'Unknown vendor';
  const invoiceNumber = extracted.invoiceNumber || 'Unknown invoice';
  const amount = typeof extracted.totalAmount === 'number' ? extracted.totalAmount.toFixed(2) : 'Unknown amount';
  const reasons = signals.length
    ? signals.map((signal) => signal.reason).slice(0, 3).join(' ')
    : 'No significant issues were detected.';

  return `${vendor} invoice ${invoiceNumber} for ${amount} ${extracted.currency || ''}`
    .trim()
    .concat(` was scored ${risk.level}. ${reasons} Recommended action: ${risk.action}.`);
}

async function generateExplanation({ extracted, signals, risk }) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

  if (!endpoint || !apiKey || !deployment) {
    return buildTemplateExplanation({ extracted, signals, risk });
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const prompt = {
    role: 'user',
    content: `You are an invoice auditor. Write a concise explanation (2-3 sentences) for the risk rating.\nInvoice: ${JSON.stringify(extracted)}\nSignals: ${JSON.stringify(signals)}\nRisk: ${JSON.stringify(risk)}`,
  };

  try {
    const response = await axios.post(
      url,
      {
        messages: [
          { role: 'system', content: 'You summarize invoice risk for auditors in plain English.' },
          prompt,
        ],
        temperature: 0.2,
        max_tokens: 120,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const message = response.data?.choices?.[0]?.message?.content;
    if (message) {
      return message.trim();
    }
  } catch (error) {
    return buildTemplateExplanation({ extracted, signals, risk });
  }

  return buildTemplateExplanation({ extracted, signals, risk });
}

module.exports = {
  generateExplanation,
};
