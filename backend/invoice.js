import PDFDocument from 'pdfkit';

const GOLD = '#c9a24b';
const CHARCOAL = '#2b2926';
const GRAY = '#6b6b6b';

/**
 * Generates a PDF invoice buffer for a booking or an order.
 * @param {{
 *   invoiceNumber: string,
 *   date: Date,
 *   customer: { name: string, email: string, phone: string },
 *   lineItems: { label: string, detail?: string, price: number, quantity?: number }[],
 *   total: number,
 *   kind: 'Réservation' | 'Commande'
 * }} params
 * @returns {Promise<Buffer>}
 */
export function generateInvoicePdf(params) {
  const { invoiceNumber, date, customer, lineItems, total, kind } = params;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(22)
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .text('SAKINA MASSAGE 974', 50, 50);
    doc
      .fontSize(9)
      .fillColor(GOLD)
      .font('Helvetica')
      .text('BIEN-ÊTRE · DÉTENTE · HARMONIE', 50, 78);

    doc
      .fontSize(9)
      .fillColor(GRAY)
      .text('130 Rue Marius et Ary Leblond', 50, 100)
      .text('Saint-Paul, 97460, La Réunion, France', 50, 112)
      .text('WhatsApp : +92 303 5442047', 50, 124);

    // Invoice meta (right side)
    doc
      .fontSize(16)
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .text(`FACTURE — ${kind}`, 300, 50, { width: 245, align: 'right' });
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(GRAY)
      .text(`N° ${invoiceNumber}`, 300, 78, { width: 245, align: 'right' })
      .text(date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }), 300, 90, {
        width: 245,
        align: 'right',
      });

    // Divider
    doc.moveTo(50, 150).lineTo(545, 150).strokeColor('#e5e5e5').stroke();

    // Customer block
    doc
      .fontSize(10)
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .text('Facturé à', 50, 165);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor(GRAY)
      .text(customer.name, 50, 180)
      .text(customer.email, 50, 194)
      .text(customer.phone, 50, 208);

    // Line items table
    let y = 250;
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(CHARCOAL)
      .text('DESCRIPTION', 50, y)
      .text('QTÉ', 380, y, { width: 40, align: 'center' })
      .text('PRIX', 440, y, { width: 105, align: 'right' });

    y += 18;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#e5e5e5').stroke();
    y += 12;

    doc.font('Helvetica').fillColor(GRAY);
    for (const item of lineItems) {
      const qty = item.quantity ?? 1;
      doc.fontSize(10).fillColor(CHARCOAL).text(item.label, 50, y, { width: 320 });
      if (item.detail) {
        doc.fontSize(8).fillColor(GRAY).text(item.detail, 50, y + 13, { width: 320 });
      }
      doc.fontSize(10).fillColor(GRAY).text(String(qty), 380, y, { width: 40, align: 'center' });
      doc.fontSize(10).fillColor(CHARCOAL).text(`${(item.price * qty).toFixed(2)} €`, 440, y, { width: 105, align: 'right' });
      y += item.detail ? 34 : 26;
    }

    y += 10;
    doc.moveTo(300, y).lineTo(545, y).strokeColor('#e5e5e5').stroke();
    y += 14;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor(CHARCOAL)
      .text('TOTAL', 300, y, { width: 140 })
      .fillColor(GOLD)
      .text(`${total.toFixed(2)} €`, 440, y, { width: 105, align: 'right' });

    // Footer
    doc
      .fontSize(8)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text('Merci de votre confiance. Offrez à votre corps la légèreté qu\'il mérite.', 50, 750, {
        width: 495,
        align: 'center',
      });

    doc.end();
  });
}
