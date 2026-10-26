import { InvoiceStatus, Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';
import { InvoiceError } from '../invoice.errors';
import { asDateOnly, sumPayments } from './invoice.helpers';
import type { CreatePaymentPayload } from './types';

const createPayment = async (payload: CreatePaymentPayload) =>
  prisma.$transaction(async (transaction) => {
    const invoice = await transaction.invoice.findUnique({
      where: { id: payload.invoice_id },
      include: { payments: { select: { amount: true } } },
    });
    if (!invoice) throw new InvoiceError('Invoice not found', 404);
    if (invoice.customer_id !== payload.customer_id) {
      throw new InvoiceError('Payment customer does not match the invoice customer', 400);
    }
    if (invoice.status === InvoiceStatus.DRAFT) {
      throw new InvoiceError('Payments can only be recorded for issued invoices', 409);
    }

    const amount = new Prisma.Decimal(payload.amount);
    const amountPaid = sumPayments(invoice.payments);
    const balanceDue = new Prisma.Decimal(invoice.total).sub(amountPaid);
    if (amount.gt(balanceDue)) {
      throw new InvoiceError('Payment amount exceeds the invoice balance due', 400);
    }

    const payment = await transaction.payment.create({
      data: {
        invoice_id: invoice.id,
        customer_id: invoice.customer_id,
        payment_date: payload.payment_date
          ? asDateOnly(payload.payment_date)
          : asDateOnly(new Date().toISOString()),
        amount,
        payment_method: payload.payment_method,
        reference_number: payload.reference_number || null,
      },
    });

    if (amount.eq(balanceDue)) {
      await transaction.invoice.update({
        where: { id: invoice.id },
        data: { status: InvoiceStatus.PAID },
      });
    }

    return payment;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export { createPayment };
