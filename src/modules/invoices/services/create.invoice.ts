import { randomUUID } from 'node:crypto';
import { InvoiceStatus, Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';
import { InvoiceError } from '../invoice.errors';
import { asDateOnly } from './invoice.helpers';
import type { CreateInvoicePayload } from './types';

const createInvoice = async (payload: CreateInvoicePayload) => {
  const customer = await prisma.customer.findFirst({
    where: { id: payload.customer_id, is_deleted: false },
    select: { id: true },
  });
  if (!customer) {
    throw new InvoiceError('Customer not found', 404);
  }

  const invoiceDate = payload.invoice_date
    ? asDateOnly(payload.invoice_date)
    : asDateOnly(new Date().toISOString());
  const dueDate = asDateOnly(payload.due_date);
  if (dueDate < invoiceDate) {
    throw new InvoiceError('Due date cannot be before the invoice date', 400);
  }

  let subTotal = new Prisma.Decimal(0);
  let taxAmount = new Prisma.Decimal(0);
  const lineItems = payload.line_items.map((item) => {
    const quantity = new Prisma.Decimal(item.quantity);
    const unitPrice = new Prisma.Decimal(item.unit_price);
    const taxRate = new Prisma.Decimal(item.tax_rate);
    const lineTotal = quantity.mul(unitPrice).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
    const lineTax = lineTotal.mul(taxRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
    subTotal = subTotal.add(lineTotal);
    taxAmount = taxAmount.add(lineTax);

    return {
      description: item.description,
      quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      line_total: lineTotal,
    };
  });

  return prisma.invoice.create({
    data: {
      invoice_number: `INV-${randomUUID().toUpperCase()}`,
      customer_id: customer.id,
      invoice_date: invoiceDate,
      due_date: dueDate,
      status: InvoiceStatus.DRAFT,
      sub_total: subTotal,
      tax_amount: taxAmount,
      total: subTotal.add(taxAmount),
      line_items: { create: lineItems },
    },
    include: {
      line_items: true,
      customer: { select: { id: true, first_name: true, last_name: true, email: true } },
    },
  });
};

export { createInvoice };
