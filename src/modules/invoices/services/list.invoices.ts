import { Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';
import { sumPayments } from './invoice.helpers';
import type { ListInvoicesQuery } from './types';

const listInvoices = async (query: ListInvoicesQuery) => {
  const where: Prisma.InvoiceWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.customer_id) where.customer_id = query.customer_id;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { created_at: 'desc' },
      include: {
        customer: { select: { id: true, first_name: true, last_name: true, email: true } },
        payments: { select: { amount: true } },
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  const items = invoices.map(({ payments, ...invoice }) => {
    const amountPaid = sumPayments(payments);
    return {
      ...invoice,
      amount_paid: amountPaid,
      balance_due: new Prisma.Decimal(invoice.total).sub(amountPaid),
    };
  });

  return {
    items,
    page: query.page,
    limit: query.limit,
    total,
    pages: Math.ceil(total / query.limit),
  };
};

export { listInvoices };
