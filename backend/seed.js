// Seeds the services table from the real catalog (matches src/pages/Services.tsx / BookNow.tsx).
// Run with: node seed.js
import { prisma } from './db.js';

// Prices store the "Tarif Public" amount; the "Tarif Personnel" (public/private sector staff) price
// is shown alongside it on the Services page — see PERSONNEL_PRICES in src/pages/Services.tsx.
const services = [
  { category: 'Head Spa', name: 'Head Spa + Massage Sur Zone Ciblée', duration: '1h30', price: 100 },
  { category: 'Foot Spa', name: 'Foot Spa + Massage Des Jambes', duration: '1h30', price: 100 },
  { category: 'Massage Abhyanga', name: 'Massage Abhyanga - Rituel Ayurvédique', duration: '1h30', price: 95 },
  { category: 'Pack Bien-Être', name: 'Pack Bien-Être', duration: '1h30', price: 100 },
];

const products = [];

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

  // Remove services that are no longer in the catalog (retired offerings).
  // Services with existing bookings are kept (FK constraint) and just logged.
  const currentNames = services.map((s) => s.name);
  const stale = await prisma.service.findMany({ where: { name: { notIn: currentNames } } });
  for (const s of stale) {
    const bookingCount = await prisma.bookingService.count({ where: { serviceId: s.id } });
    if (bookingCount > 0) {
      console.log(`Kept retired service (has ${bookingCount} booking(s)): ${s.name}`);
      continue;
    }
    await prisma.service.delete({ where: { id: s.id } });
    console.log(`Deleted retired service: ${s.name}`);
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
