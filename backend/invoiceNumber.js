// Generates a human-readable invoice number, e.g. "SM974-20260829-4F2A"
export function generateInvoiceNumber(prefix = 'SM974') {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}
