import { InvoiceStatus } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';
import { InvoiceError } from '../invoice.errors';
import { getInvoice } from './get.invoice';

const issueInvoice = async (id: number) => {
  const updated = await prisma.invoice.updateMany({
    where: { id, status: InvoiceStatus.DRAFT },
    data: { status: InvoiceStatus.ISSUED },
  });
  if (updated.count === 0) {
    const invoice = await prisma.invoice.findUnique({ where: { id }, select: { id: true } });
    if (!invoice) throw new InvoiceError('Invoice not found', 404);
    throw new InvoiceError('Only draft invoices can be issued', 409);
  }

  return getInvoice(id);
};

export { issueInvoice };
