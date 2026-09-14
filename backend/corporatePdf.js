import PDFDocument from 'pdfkit';

const CHARCOAL = '#2b2926';
const GOLD = '#c9a24b';
const GRAY = '#6b6b6b';
const PAGE_WIDTH = 495; // A4 minus 50pt margins each side

const orgTypeLabel = (v) => {
  if (v === 'publique') return 'Publique';
  if (v === 'privee') return 'Privée';
  return v || '—';
};

/**
 * Generates a compact, single-page French PDF for a submitted "Tarif Personnel"
 * eligibility form (public/private sector staff rate).
 * @returns {Promise<Buffer>}
 */
export function generateCorporatePdf(form) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).fillColor(CHARCOAL).font('Helvetica-Bold').text('SAKINA MASSAGE 974', 50, 50);
    doc.fontSize(8).fillColor(GOLD).font('Helvetica').text('PRATICIENNE EN MASSAGE BIEN-ÊTRE', 50, 72);

    doc
      .fontSize(12)
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .text('FORMULAIRE TARIF PERSONNEL', 250, 52, { width: 295, align: 'right' });
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(GRAY)
      .text(new Date(form.createdAt || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }), 250, 68, {
        width: 295,
        align: 'right',
      });

    doc.moveTo(50, 90).lineTo(545, 90).strokeColor('#e5e5e5').stroke();

    let y = 100;
    const section = (title) => {
      doc.rect(50, y, PAGE_WIDTH, 16).fill(CHARCOAL);
      doc.fillColor('#f6f1e7').fontSize(8).font('Helvetica-Bold').text(title.toUpperCase(), 58, y + 4);
      y += 22;
    };
    const row = (label, value) => {
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CHARCOAL).text(`${label} : `, 50, y, { continued: true, width: PAGE_WIDTH });
      doc.font('Helvetica').fillColor(GRAY).text(value || '—');
      y = doc.y + 4;
    };
    const rowPair = (label1, value1, label2, value2) => {
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CHARCOAL).text(`${label1} : `, 50, y, { continued: true, width: 240 });
      doc.font('Helvetica').fillColor(GRAY).text(value1 || '—');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CHARCOAL).text(`${label2} : `, 300, y, { continued: true, width: 245 });
      doc.font('Helvetica').fillColor(GRAY).text(value2 || '—');
      y += 16;
    };

    section('Informations personnelles');
    rowPair('Nom', form.lastName, 'Prénom', form.firstName);
    rowPair('Date de naissance', form.birthDate, 'Téléphone', form.phone);
    y += 6;

    section('Informations entreprise');
    row("Type d'entreprise", orgTypeLabel(form.organizationType));
    row('Nom de la société', form.companyName);
    rowPair("Tranche d'effectifs", form.employeeCountRange, "Nombre exact d'employés", form.employeeCount);
    y += 6;

    doc
      .fontSize(7)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text('Ce formulaire permet de vérifier votre éligibilité au tarif personnel réservé aux personnels du secteur public & privé.', 50, y, {
        width: PAGE_WIDTH,
      });
    y = doc.y + 20;

    doc
      .fontSize(7)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text('Document généré automatiquement lors de la soumission du formulaire en ligne.', 50, y, {
        width: PAGE_WIDTH,
        align: 'center',
      });

    doc.end();
  });
}
