import { Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';
import { InvoiceError } from '../invoice.errors';
import { sumPayments } from './invoice.helpers';

const getInvoice = async (id: number) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, first_name: true, last_name: true, email: true, gst_number: true } },
      line_items: true,
      payments: { orderBy: { payment_date: 'desc' } },
    },
  });

  if (!invoice) {
    throw new InvoiceError('Invoice not found', 404);
  }

  const amountPaid = sumPayments(invoice.payments);
  return {
    ...invoice,
    amount_paid: amountPaid,
    balance_due: new Prisma.Decimal(invoice.total).sub(amountPaid),
  };
};

export { getInvoice };
