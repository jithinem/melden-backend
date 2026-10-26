import prisma from '@/shared/prisma';

const seedCustomers = async () => {
  const customers = [
    {
      first_name: 'Acme',
      last_name: 'Corporation',
      email: 'accounts@acme.example',
      phone_number: '1234567890',
      gst_number: '29ABCDE1234F1Z5',
    },
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '0987654321',
      gst_number: null,
    },
  ];

  for (const customer of customers) {
    const existing = await prisma.customer.findUnique({
      where: { email: customer.email },
      select: { id: true },
    });

    if (existing) continue;

    await prisma.customer.create({
      data: customer,
    });
    console.log(`Customer '${customer.email}' created successfully.`);
  }
};

export { seedCustomers };