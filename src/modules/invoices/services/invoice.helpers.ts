import { Prisma } from '@/generated/prisma/client';

const asDateOnly = (value: string): Date => new Date(`${value.slice(0, 10)}T00:00:00.000Z`);

const sumPayments = (payments: Array<{ amount: Prisma.Decimal }>): Prisma.Decimal =>
  payments.reduce((total, payment) => total.add(payment.amount), new Prisma.Decimal(0));

export { asDateOnly, sumPayments };
