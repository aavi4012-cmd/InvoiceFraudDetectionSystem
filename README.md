<<<<<<< HEAD
# Invoice Fraud Watch

MVP web app to upload invoices, extract key fields via Azure Document Intelligence, run fraud/anomaly checks, and review risk signals in a clean UI.

## Stack
- MongoDB + Mongoose
- Express + Node.js
- React (Vite)
- Azure Document Intelligence (prebuilt invoice)
- Azure ML (optional endpoint with fallback to local z-score)
- Azure OpenAI (optional explanation)

## Prerequisites
- Node.js 18+
- MongoDB running locally or accessible via `MONGO_URI`
- Azure Document Intelligence resource + key

## Environment setup
### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice_fraud_watch
CLIENT_ORIGIN=http://localhost:5173
AZURE_DI_ENDPOINT=
AZURE_DI_KEY=
AML_ENDPOINT_URL=
AML_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_KEY=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Run the app
```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo data generator
This creates 6 synthetic invoices (PDFs) and uploads them via the API.
```bash
# from repo root
npm install
npm run demo
```
By default it posts to `http://localhost:5000/api/invoices/upload`. Override with:
```bash
DEMO_API_URL=http://localhost:5000/api/invoices/upload npm run demo
```

### Demo scenarios included
- Exact duplicate invoice
- Near duplicate (same vendor, similar amount, close date)
- Invalid GSTIN
- Amount anomaly (vendor history exists)
- Two clean invoices

## Azure integration notes
### Document Intelligence (required)
- Set `AZURE_DI_ENDPOINT` and `AZURE_DI_KEY` in `server/.env`.
- The backend uses the official SDK to call the prebuilt invoice model.

### Azure ML (optional endpoint)
- If `AML_ENDPOINT_URL` and `AML_API_KEY` are set, the backend calls the endpoint.
- If they are missing, the backend computes a local z-score and still returns a risk signal.
- A minimal notebook lives at `azureml/InvoiceAnomalyEndpoint.ipynb` with deployment notes.

### Azure OpenAI (optional)
- If `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, and `AZURE_OPENAI_DEPLOYMENT` are set, a short auditor explanation is generated.
- Otherwise, a template explanation is stored.

## Privacy
- Use the **Delete All** button on the risk list to remove stored invoices and files.

## Limitations
- MVP extraction accuracy depends on document quality.
- No signature/approval system; risk is advisory only.
- AML endpoint is optional; local z-score is used when not configured.
=======
# Invoice Fraud Watch 🚨  
### Voice-Signed, AI-Powered Invoice Fraud Detection for SMEs

## Problem
Small and medium enterprises (SMEs) lose significant money due to:
- Duplicate invoices
- Altered invoice amounts
- Fake or impersonated vendors
- Manual, slow, and error-prone verification

Existing tools are expensive, company-centric, and rely mostly on static rules.

---

## Solution
**Invoice Fraud Watch** is an AI-powered system that:
- Extracts invoice data automatically
- Detects duplicate, anomalous, and fake invoices
- Cryptographically signs invoices using **human voice biometrics**
- Explains fraud decisions in simple language

> We bind invoices to a *human voice*, making them extremely hard to forge.

---

## Key Features
- 📄 Invoice OCR using Azure Document Intelligence
- 🔁 Duplicate & near-duplicate detection
- 📊 Amount & tax anomaly detection
- 🎙️ Voice-signed invoices (unique innovation)
- 🔐 QR + cryptographic tamper detection
- 🧠 Explainable AI using Azure OpenAI
- ⚡ Fast, SME-friendly, cloud-native

---

## What Makes It Unique
| Existing Systems | Invoice Fraud Watch |
|------------------|---------------------|
Rule-based checks | AI + biometrics |
Company-only data | Network-ready design |
PDF verification | Human voice binding |
Black-box alerts | Explainable decisions |

**Voice-Signed Invoices** are not present in tools like Medius or HighRadius.

---

## Architecture (Azure)
- **Frontend:** Next.js (Azure Static Web Apps)
- **Backend:** FastAPI (Azure App Service)
- **OCR:** Azure AI Document Intelligence
- **ML:** Isolation Forest (PyOD)
- **Voice Biometrics:** SpeechBrain (ECAPA-TDNN)
- **Explainability:** Azure OpenAI
- **Storage:** Azure Blob + Azure SQL
- **Security:** Azure Key Vault

---

## Core Algorithms
- SHA-256 hashing (duplicate detection)
- Cosine similarity (near-duplicates & voice match)
- Isolation Forest (amount anomalies)
- ECAPA-TDNN (speaker embeddings)
- ECC digital signatures (QR verification)
- Weighted ensemble fraud scoring

---

## Demo Scenarios
1. Legitimate voice-signed invoice → LOW risk
2. Duplicate invoice → HIGH risk
3. Amount-tampered invoice → HIGH risk
4. Fake vendor voice → CRITICAL fraud

---

## MVP Scope
✔ Invoice upload  
✔ OCR extraction  
✔ Duplicate detection  
✔ Voice-signed QR verification  
✔ Fraud score + explanation  

---

## Roadmap
- Network-level fraud graph
- Federated learning across companies
- Blockchain anchoring
- ERP integrations (SAP, Tally, QuickBooks)

---

## Team Vision
To make invoice fraud detection **accessible, human-centered, and trustworthy** for every SME.
>>>>>>> e30b6b145d49364e3773570cb1064ccd014190cc
