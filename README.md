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
