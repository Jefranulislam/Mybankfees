import { seedAllBanks, bankData } from './seedData.js';

async function main() {
  try {
    console.log('Starting database seeding...');
    
    await seedAllBanks(bankData);
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

main();
