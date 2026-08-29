import PDFDocument from 'pdfkit';

const CHARCOAL = '#2b2926';
const GOLD = '#c9a24b';
const GRAY = '#6b6b6b';
const PAGE_WIDTH = 495; // A4 minus 50pt margins each side

const yesNoLabel = (v) => {
  if (v === 'oui') return 'Oui';
  if (v === 'non') return 'Non';
  if (v === 'par_periode') return 'Par période';
  return v || '—';
};

/**
 * Generates a compact, single-page PDF of a submitted consent/intake form,
 * mirroring the paper "Fiche de renseignements".
 * @returns {Promise<Buffer>}
 */
export function generateConsentPdf(form) {
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
      .text('FICHE DE RENSEIGNEMENTS', 300, 52, { width: 245, align: 'right' });
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(GRAY)
      .text(new Date(form.createdAt || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }), 300, 68, {
        width: 245,
        align: 'right',
      });

    doc.moveTo(50, 90).lineTo(545, 90).strokeColor('#e5e5e5').stroke();

    let y = 100;
    const section = (title) => {
      doc.rect(50, y, PAGE_WIDTH, 16).fill(CHARCOAL);
      doc.fillColor('#f6f1e7').fontSize(8).font('Helvetica-Bold').text(title.toUpperCase(), 58, y + 4);
      y += 22;
    };
    // Compact single-line "Label : Value" row — much shorter than the old two-line version.
    const row = (label, value) => {
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CHARCOAL).text(`${label} : `, 50, y, { continued: true, width: PAGE_WIDTH });
      doc.font('Helvetica').fillColor(GRAY).text(value || '—');
      y = doc.y + 4;
    };
    // Two short fields side by side on one line, to save vertical space.
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

    section('Objectifs du massage');
    row("Attentes pour cette séance", form.expectations);
    row('Zones à traiter ou à éviter', form.areasToTreat);
    y += 6;

    section('État de santé');
    rowPair('Problèmes médicaux', yesNoLabel(form.medicalConditions), 'Médicaments actuels', yesNoLabel(form.medications));
    rowPair('Allergies', yesNoLabel(form.allergies), 'Grossesse / accouchement récent', yesNoLabel(form.pregnancy));
    y += 6;

    section('Habitudes & bien-être');
    rowPair('Activité physique régulière', yesNoLabel(form.regularActivity), 'Massage professionnel auparavant', yesNoLabel(form.hadProfessionalMassage));
    row('Stress / anxiété fréquents', yesNoLabel(form.stressLevel));
    y += 6;

    section('Consentement');
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(GRAY)
      .text(
        "J'atteste que les informations fournies sont exactes et j'accepte le massage sous ma propre responsabilité. Ce soin est un massage de bien-être et de relaxation, non thérapeutique et non médicalisé.",
        50,
        y,
        { width: PAGE_WIDTH }
      );
    y = doc.y + 12;

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CHARCOAL).text('Signature électronique : ', 50, y, { continued: true });
    doc.font('Helvetica-Oblique').fillColor(GOLD).text(form.signature || '—');
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
