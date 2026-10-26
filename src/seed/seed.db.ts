import { seedCustomers } from './seed.customers';

const seedDb = async () => {
  try {
    await seedCustomers();
    // Other seeders...
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error seeding database';

    console.error('Error seeding database:', message);
  }
};

export { seedDb };