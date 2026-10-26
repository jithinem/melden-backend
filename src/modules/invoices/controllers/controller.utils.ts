import type { Response } from 'express';
import { InvoiceError } from '../invoice.errors';

const sendInvoiceError = (response: Response, error: unknown, fallback: string): Response => {
  const statusCode = error instanceof InvoiceError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : fallback;
  return response.status(statusCode).json({ success: false, message, data: null });
};

export { sendInvoiceError };
