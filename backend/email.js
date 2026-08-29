import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'muhammadnauman41@gmail.com';
// Resend's sandbox sender — works without domain verification for testing.
// Swap to a verified custom domain sender (e.g. reservations@sakinamassage974.fr) once one is set up in Resend.
const FROM_EMAIL = process.env.FROM_EMAIL || 'Sakina Massage 974 <onboarding@resend.dev>';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Sends a notification email (to the business owner) with zero or more PDF attachments.
 * Silently no-ops (logs instead) if RESEND_API_KEY isn't configured, so the rest of the
 * app keeps working in local/dev setups that haven't added a real key yet.
 *
 * @param {{
 *   subject: string,
 *   html: string,
 *   pdfBuffer?: Buffer,        // legacy single-attachment shorthand, still supported
 *   pdfFilename?: string,
 *   pdfs?: { buffer: Buffer, filename: string }[], // preferred: any number of attachments
 * }} params
 */
export async function sendNotificationEmail({ subject, html, pdfBuffer, pdfFilename, pdfs }) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — skipping real send. Would have sent:', subject);
    return { skipped: true };
  }

  try {
    const allPdfs = pdfs ?? (pdfBuffer ? [{ buffer: pdfBuffer, filename: pdfFilename || 'facture.pdf' }] : []);
    const attachments = allPdfs.length
      ? allPdfs.map((p) => ({ filename: p.filename, content: p.buffer.toString('base64') }))
      : undefined;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      html,
      attachments,
    });

    if (result.error) {
      console.error('[email] Resend error:', result.error);
      return { skipped: false, error: result.error };
    }
    console.log('[email] Sent:', subject, '->', NOTIFY_EMAIL);
    return { skipped: false, id: result.data?.id };
  } catch (err) {
    console.error('[email] Failed to send:', err);
    return { skipped: false, error: err };
  }
}

/**
 * Sends an email directly to a customer's own address (booking/order confirmation + their
 * invoice copy). Separate from sendNotificationEmail, which always goes to the fixed
 * business-owner NOTIFY_EMAIL. Same no-op-if-no-key behavior, and failures are logged but
 * never thrown — a failed customer email must never block the booking/order itself.
 */
export async function sendCustomerEmail({ to, subject, html, pdfBuffer, pdfFilename, pdfs }) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — skipping real send. Would have sent to customer:', to, subject);
    return { skipped: true };
  }

  try {
    const allPdfs = pdfs ?? (pdfBuffer ? [{ buffer: pdfBuffer, filename: pdfFilename || 'facture.pdf' }] : []);
    const attachments = allPdfs.length
      ? allPdfs.map((p) => ({ filename: p.filename, content: p.buffer.toString('base64') }))
      : undefined;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      attachments,
    });

    if (result.error) {
      console.error('[email] Resend error (customer email):', result.error);
      return { skipped: false, error: result.error };
    }
    console.log('[email] Sent to customer:', subject, '->', to);
    return { skipped: false, id: result.data?.id };
  } catch (err) {
    console.error('[email] Failed to send customer email:', err);
    return { skipped: false, error: err };
  }
}

export function customerBookingEmailHtml({ user, booking, lineItems, total, invoiceNumber }) {
  const itemsHtml = lineItems.map((i) => `<li>${i.label} — ${i.price.toFixed(2)} €</li>`).join('');

  return `
    <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
      <h2 style="color: #2b2926;">Votre réservation est confirmée — Sakina Massage 974</h2>
      <p>Bonjour ${user.name.split(' ')[0]},</p>
      <p>Merci pour votre réservation ! Voici le récapitulatif :</p>
      <p><strong>N° facture :</strong> ${invoiceNumber}</p>
      <p><strong>Date :</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
      <p><strong>Soins réservés :</strong></p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total : ${total.toFixed(2)} €</strong></p>
      <p style="color: #6b6b6b; font-size: 13px;">Votre facture PDF est jointe à cet email. À très bientôt !</p>
    </div>
  `;
}

export function customerOrderEmailHtml({ user, lineItems, total, invoiceNumber }) {
  const itemsHtml = lineItems.map((i) => `<li>${i.label} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €</li>`).join('');

  return `
    <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
      <h2 style="color: #2b2926;">Votre commande est confirmée — Sakina Massage 974</h2>
      <p>Bonjour ${user.name.split(' ')[0]},</p>
      <p>Merci pour votre commande ! Voici le récapitulatif :</p>
      <p><strong>N° facture :</strong> ${invoiceNumber}</p>
      <p><strong>Articles :</strong></p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total : ${total.toFixed(2)} €</strong></p>
      <p style="color: #6b6b6b; font-size: 13px;">Votre facture PDF est jointe à cet email. À très bientôt !</p>
    </div>
  `;
}

export function bookingEmailHtml({ user, booking, lineItems, total, invoiceNumber }) {
  const itemsHtml = lineItems
    .map((i) => `<li>${i.label} — ${i.price.toFixed(2)} €</li>`)
    .join('');

  return `
    <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
      <h2 style="color: #2b2926;">Nouvelle réservation — Sakina Massage 974</h2>
      <p><strong>N° facture :</strong> ${invoiceNumber}</p>
      <p><strong>Client :</strong> ${user.name} (${user.email}, ${user.phone})</p>
      <p><strong>Date :</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
      ${booking.message ? `<p><strong>Message :</strong> ${booking.message}</p>` : ''}
      <p><strong>Soins réservés :</strong></p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total : ${total.toFixed(2)} €</strong></p>
      <p style="color: #6b6b6b; font-size: 13px;">La facture PDF est jointe à cet email.</p>
    </div>
  `;
}

export function orderEmailHtml({ user, order, lineItems, total, invoiceNumber }) {
  const itemsHtml = lineItems
    .map((i) => `<li>${i.label} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €</li>`)
    .join('');

  return `
    <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
      <h2 style="color: #2b2926;">Nouvelle commande boutique — Sakina Massage 974</h2>
      <p><strong>N° facture :</strong> ${invoiceNumber}</p>
      <p><strong>Client :</strong> ${user.name} (${user.email}, ${user.phone})</p>
      <p><strong>Articles :</strong></p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total : ${total.toFixed(2)} €</strong></p>
      <p style="color: #6b6b6b; font-size: 13px;">La facture PDF est jointe à cet email.</p>
    </div>
  `;
}

export function consentFormEmailHtml({ user, form, booking }) {
  const bookingBlock = booking
    ? `
      <p><strong>N° facture liée :</strong> ${booking.invoiceNumber}</p>
      <p><strong>Réservation :</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
    `
    : '';

  return `
    <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
      <h2 style="color: #2b2926;">Nouvelle fiche de renseignements — Sakina Massage 974</h2>
      <p><strong>Client :</strong> ${form.firstName} ${form.lastName} (${user.email}, ${form.phone})</p>
      ${bookingBlock}
      <p><strong>Date de naissance :</strong> ${form.birthDate}</p>
      <p><strong>Attentes :</strong> ${form.expectations || '—'}</p>
      <p><strong>Zones à traiter/éviter :</strong> ${form.areasToTreat || '—'}</p>
      <p><strong>Problèmes médicaux :</strong> ${form.medicalConditions || '—'}</p>
      <p><strong>Médicaments :</strong> ${form.medications || '—'}</p>
      <p><strong>Allergies :</strong> ${form.allergies || '—'}</p>
      <p><strong>Grossesse/accouchement récent :</strong> ${form.pregnancy || '—'}</p>
      <p><strong>Activité physique régulière :</strong> ${form.regularActivity || '—'}</p>
      <p><strong>Massage professionnel auparavant :</strong> ${form.hadProfessionalMassage || '—'}</p>
      <p><strong>Niveau de stress :</strong> ${form.stressLevel || '—'}</p>
      <p><strong>Signature :</strong> ${form.signature || '—'}</p>
      <p style="color: #6b6b6b; font-size: 13px;">
        ${booking ? 'La fiche de renseignements et la facture de la réservation liée sont jointes à cet email.' : 'La fiche de renseignements est jointe à cet email.'}
      </p>
    </div>
  `;
}
