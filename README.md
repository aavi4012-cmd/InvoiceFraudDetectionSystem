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
