// Seeds the services table from the real catalog (matches src/pages/Services.tsx / BookNow.tsx).
// Run with: node seed.js
import { prisma } from './db.js';

const services = [
  // Bundle pack listed first so it always appears at the top of Services/BookNow.
  { category: 'Bundle Pack', name: 'Massage Drainant - 4 Séances', duration: '4 x 1 heure', price: 200 },
  { category: 'Massages By Anissah', name: 'Massage Duo - Résa Uniquement Le Samedi', duration: '1 heure', price: 120 },
  { category: 'Massages By Anissah', name: 'La Rose Thérapie & Massage Body Touch Oriental', duration: '1h30', price: 150 },
  { category: "Les Cures d'Anissah", name: 'Massage Drainant', duration: '1 heure', price: 75 },
  { category: "Les Formules Head Spa d'Anissah", name: 'Head Spa Premium', duration: '1 heure', price: 100 },
  { category: "Les Formules Head Spa d'Anissah", name: 'Head Spa + Massage Relaxant', duration: '1 heure', price: 100 },
  { category: "Les Formules Head Spa d'Anissah", name: 'Head Spa + Massage Relaxant En Duo', duration: '1h30', price: 150 },
  { category: "Bon Cadeau d'Anissah", name: 'Bon Cadeau - Massage Relaxant', duration: '1 heure', price: 60 },
  { category: 'Ventousothérapie / Cupping Therapy By Anissah', name: 'Massage Deep Tissue + Ventouse', duration: '1 heure', price: 110 },
  { category: 'Foot Spa', name: 'Foot Spa', duration: '1 heure', price: 100 },
];

const products = [
  {
    name: 'Massage Drainant',
    price: 200,
    applicableServices: 'Massage Drainant',
    appointments: 4,
    validity: 'Sans expiration',
  },
];

async function main() {
  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({ data: s });
      console.log(`Created service: ${s.name}`);
    } else if (existing.category !== s.category || existing.duration !== s.duration || existing.price !== s.price) {
      // Self-heal: keep existing rows in sync with the seed catalog (e.g. category renames)
      // instead of only creating brand-new rows.
      await prisma.service.update({
        where: { id: existing.id },
        data: { category: s.category, duration: s.duration, price: s.price },
      });
      console.log(`Updated service: ${s.name}`);
    } else {
      console.log(`Skipped (already up to date): ${s.name}`);
    }
  }

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
      console.log(`Created product: ${p.name}`);
    } else {
      console.log(`Skipped (already exists): ${p.name}`);
    }
  }
}

main()
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
