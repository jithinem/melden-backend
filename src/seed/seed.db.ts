import { seedCustomers } from './seed.customers';
import { seedInvoices } from './invoice.seed';

const seedDb = async () => {
  try {
    await seedCustomers();
    await seedInvoices();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error seeding database';

    console.error('Error seeding database:', message);
  }
};

export { seedDb };