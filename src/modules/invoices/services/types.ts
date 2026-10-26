import type { InvoiceStatus } from '@/generated/prisma/client';

interface CreateInvoicePayload {
  customer_id: number;
  invoice_date?: string;
  due_date: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }>;
}

interface ListInvoicesQuery {
  page: number;
  limit: number;
  status?: InvoiceStatus;
  customer_id?: number;
}

interface CreatePaymentPayload {
  invoice_id: number;
  customer_id: number;
  payment_date?: string;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'UPI';
  reference_number?: string | null;
}

export type { CreateInvoicePayload, ListInvoicesQuery, CreatePaymentPayload };
