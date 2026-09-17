import PDFDocument from 'pdfkit';

const CHARCOAL = '#2b2926';
const TEAL = '#0f9b8e';
const GRAY = '#6b6b6b';
const LINE = '#d9d9d9';
const CELL_BG = '#f5f5f5';
const PAGE_WIDTH = 495; // A4 minus 50pt margins each side

const yesNoLabel = (v) => {
  if (v === 'oui') return 'Oui / Yes';
  if (v === 'non') return 'Non / No';
  if (v === 'par_periode') return 'Par période / Sometimes';
  return v || '';
};

const orgTypeLabel = (v) => {
  const publique = v === 'publique' ? '[X]' : '[ ]';
  const privee = v === 'privee' ? '[X]' : '[ ]';
  return `${publique} Publique / Public    ${privee} Privée / Private`;
};

const rangeLabel = (v) => {
  const mark = (r) => (v === r ? '[X]' : '[ ]');
  return `${mark('1-10')} 1–10   ${mark('11-50')} 11–50   ${mark('51-250')} 51–250   ${mark('250+')} 250+`;
};

/**
 * Generates a bilingual (FR/EN) single-page PDF "Fiche de renseignements" combining
 * personal info, corporate/staff-rate eligibility, massage objectives, health &
 * wellbeing, and consent — the single mandatory intake form for every booking.
 * @returns {Promise<Buffer>}
 */
export function generateCorporatePdf(form) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(16)
      .fillColor(CHARCOAL)
      .font('Helvetica-Bold')
      .text('SAKINA MASSAGE 974', 50, 50, { width: PAGE_WIDTH, align: 'center' });
    doc
      .fontSize(9)
      .fillColor(GRAY)
      .font('Helvetica-Oblique')
      .text('PRATICIENNE EN MASSAGE BIEN-ETRE / WELLNESS MASSAGE PRACTITIONER', 50, 72, { width: PAGE_WIDTH, align: 'center' });

    doc
      .fontSize(12)
      .fillColor(TEAL)
      .font('Helvetica-Bold')
      .text('FICHE DE RENSEIGNEMENTS / INFORMATION FORM', 50, 94, { width: PAGE_WIDTH, align: 'center' });
    doc
      .fontSize(8.5)
      .fillColor(GRAY)
      .font('Helvetica-Oblique')
      .text(
        `Date: ${new Date(form.createdAt || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} / ${new Date(
          form.createdAt || Date.now()
        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        50,
        112,
        { width: PAGE_WIDTH, align: 'center' }
      );

    let y = 135;

    const sectionTitle = (title) => {
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(CHARCOAL).text(title.toUpperCase(), 50, y);
      y += 13;
      doc.moveTo(50, y).lineTo(545, y).strokeColor(TEAL).lineWidth(1.2).stroke();
      y += 8;
    };

    // A two-column table row: label cell (shaded) + value cell, each side by side (2 pairs per row).
    const tableRow = (cells) => {
      // cells: [{label, value, width}] filling the 495pt row
      const rowHeight = 26;
      let x = 50;
      for (const cell of cells) {
        doc.rect(x, y, cell.width, rowHeight).fillAndStroke(CELL_BG, LINE);
        doc
          .fontSize(7.5)
          .font('Helvetica-Bold')
          .fillColor(CHARCOAL)
          .text(cell.label, x + 6, y + 4, { width: cell.width - 12 });
        doc
          .fontSize(8.5)
          .font('Helvetica')
          .fillColor(CHARCOAL)
          .text(cell.value || '', x + 6, y + 14, { width: cell.width - 12 });
        x += cell.width;
      }
      y += rowHeight;
    };

    // A full-width shaded row with label on the left, value on the right (for longer values).
    const fullRow = (label, value, height = 26) => {
      doc.rect(50, y, PAGE_WIDTH, height).fillAndStroke(CELL_BG, LINE);
      doc
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .fillColor(CHARCOAL)
        .text(label, 56, y + 4, { width: 260 });
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(CHARCOAL)
        .text(value || '', 320, y + (height > 26 ? 4 : 8), { width: 215 });
      y += height;
    };

    // INFORMATIONS PERSONNELLES / PERSONAL INFORMATION
    sectionTitle('Informations personnelles / Personal information');
    tableRow([
      { label: 'Nom / Last Name:', value: form.lastName, width: 247.5 },
      { label: 'Prénom / First Name:', value: form.firstName, width: 247.5 },
    ]);
    tableRow([
      { label: 'Date de naissance / DOB:', value: form.birthDate, width: 247.5 },
      { label: 'Téléphone / Phone:', value: form.phone, width: 247.5 },
    ]);
    y += 10;

    // INFORMATIONS ENTREPRISE / CORPORATE DETAILS
    sectionTitle("Informations entreprise / Corporate details");
    fullRow("Type d'entreprise / Organization Type:", orgTypeLabel(form.organizationType));
    fullRow('Nom de la société / Company Name:', form.companyName);
    fullRow("Tranche d'effectifs / Employee Count Range:", rangeLabel(form.employeeCountRange), 34);
    fullRow("Nombre exact d'employés / Total Employee Count:", form.employeeCount);
    y += 10;

    // OBJECTIFS DU MASSAGE / MASSAGE OBJECTIVES
    sectionTitle('Objectifs du massage / Massage objectives');
    fullRow('Attentes / Expectations:', form.expectations);
    fullRow('Zones à traiter ou éviter / Focus or avoid areas:', form.areasToTreat, 34);
    y += 10;

    // SANTÉ & BIEN-ÊTRE / HEALTH & WELLBEING
    sectionTitle('Santé & bien-être / Health & wellbeing');
    tableRow([
      { label: 'Problèmes médicaux / Medical conditions:', value: yesNoLabel(form.medicalConditions), width: 247.5 },
      { label: 'Allergies / Allergies:', value: form.allergies, width: 247.5 },
    ]);
    tableRow([
      { label: 'Médicaments actuels / Current medications:', value: yesNoLabel(form.medications), width: 247.5 },
      { label: 'Grossesse / Pregnancy:', value: yesNoLabel(form.pregnancy), width: 247.5 },
    ]);
    tableRow([
      { label: 'Activité physique / Regular exercise:', value: yesNoLabel(form.regularActivity), width: 247.5 },
      { label: 'Stress / Anxiété / Stress level:', value: yesNoLabel(form.stressLevel), width: 247.5 },
    ]);
    tableRow([{ label: 'Massage prof. antérieur / Prior pro massage:', value: yesNoLabel(form.hadProfessionalMassage), width: 495 }]);
    y += 10;

    // CONSENTEMENT / CONSENT
    sectionTitle('Consentement / Consent');
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
    y = doc.y + 2;
    doc
      .fontSize(8)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text(
        'I certify that the information provided is accurate and accept the massage at my own responsibility. This service is a wellness and relaxation massage, non-therapeutic and non-medical.',
        50,
        y,
        { width: PAGE_WIDTH }
      );
    y = doc.y + 10;

    fullRow('Signature électronique / Electronic Signature:', form.signature ? '(signed)' : '');

    y += 20;
    doc
      .fontSize(7)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text('Document généré automatiquement lors de la soumission du formulaire en ligne.', 50, y, {
        width: PAGE_WIDTH,
        align: 'center',
      });
    doc
      .fontSize(7)
      .font('Helvetica-Oblique')
      .fillColor(GRAY)
      .text('Document automatically generated upon online form submission.', 50, doc.y + 2, {
        width: PAGE_WIDTH,
        align: 'center',
      });

    doc.end();
  });
}
