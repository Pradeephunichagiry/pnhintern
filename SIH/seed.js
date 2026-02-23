const seedDatabase = require('./src/lib/seed.ts').default;

seedDatabase().then(() => {
  console.log('Seeded');
  process.exit(0);
}).catch(console.error);
