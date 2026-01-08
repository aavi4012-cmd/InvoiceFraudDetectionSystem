import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';

function formatAmount(amount, currency) {
  if (amount === null || amount === undefined || amount === '') return '--';
  const number = Number(amount);
  if (Number.isNaN(number)) return amount;
  return `${currency || ''} ${number.toFixed(2)}`.trim();
}

export default function InvoiceTable({ invoices }) {
  if (!invoices.length) {
    return <div className="empty-state">No invoices found.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Vendor</th>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Top Reasons</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>
                <Link to={`/invoices/${invoice._id}`}>{invoice.fileName}</Link>
              </td>
              <td>{invoice.extracted?.vendorName || '--'}</td>
              <td>{invoice.extracted?.invoiceNumber || '--'}</td>
              <td>
                {invoice.extracted?.invoiceDate
                  ? new Date(invoice.extracted.invoiceDate).toLocaleDateString()
                  : '--'}
              </td>
              <td>{formatAmount(invoice.extracted?.totalAmount, invoice.extracted?.currency)}</td>
              <td>
                <RiskBadge level={invoice.risk?.level} />
              </td>
              <td>{invoice.risk?.topReasons?.join(' / ') || '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
