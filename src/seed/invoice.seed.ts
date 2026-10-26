import { InvoiceStatus, Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';

const seedInvoices = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dueDate = new Date(today);
  dueDate.setUTCDate(dueDate.getUTCDate() + 30);

  const invoiceSeeds = [
    {
      invoice_number: 'DEMO-INV-ACME-001',
      customer_email: 'accounts@acme.example',
      status: InvoiceStatus.ISSUED,
      line_items: [
        { description: 'Software development services', quantity: '10', unit_price: '150.00', tax_rate: '18.00' },
        { description: 'Technical support', quantity: '2', unit_price: '75.00', tax_rate: '18.00' },
      ],
    },
    {
      invoice_number: 'DEMO-INV-JOHN-001',
      customer_email: 'john@example.com',
      status: InvoiceStatus.DRAFT,
      line_items: [
        { description: 'Consulting session', quantity: '3', unit_price: '100.00', tax_rate: '18.00' },
      ],
    },
    {
      invoice_number: 'DEMO-INV-MELDEN-001',
      customer_email: 'finance@melden.example',
      status: InvoiceStatus.ISSUED,
      line_items: [
        { description: 'Annual subscription', quantity: '1', unit_price: '500.00', tax_rate: '18.00' },
      ],
    },
  ];

  for (const seed of invoiceSeeds) {
    const existing = await prisma.invoice.findUnique({
      where: { invoice_number: seed.invoice_number },
      select: { id: true },
    });
    if (existing) continue;

    const customer = await prisma.customer.findUnique({
      where: { email: seed.customer_email },
      select: { id: true },
    });
    if (!customer) {
      throw new Error(`Cannot seed invoice ${seed.invoice_number}: customer '${seed.customer_email}' not found`);
    }

    let subTotal = new Prisma.Decimal(0);
    let taxAmount = new Prisma.Decimal(0);
    const lineItems = seed.line_items.map((item) => {
      const lineTotal = new Prisma.Decimal(item.quantity).mul(item.unit_price).toDecimalPlaces(2);
      const lineTax = lineTotal.mul(item.tax_rate).div(100).toDecimalPlaces(2);
      subTotal = subTotal.add(lineTotal);
      taxAmount = taxAmount.add(lineTax);

      return {
        description: item.description,
        quantity: new Prisma.Decimal(item.quantity),
        unit_price: new Prisma.Decimal(item.unit_price),
        tax_rate: new Prisma.Decimal(item.tax_rate),
        line_total: lineTotal,
      };
    });

    await prisma.invoice.create({
      data: {
        invoice_number: seed.invoice_number,
        customer_id: customer.id,
        invoice_date: today,
        due_date: dueDate,
        status: seed.status,
        sub_total: subTotal,
        tax_amount: taxAmount,
        total: subTotal.add(taxAmount),
        line_items: { create: lineItems },
      },
    });
    console.log(`Invoice '${seed.invoice_number}' created successfully.`);
  }
};

export { seedInvoices };
