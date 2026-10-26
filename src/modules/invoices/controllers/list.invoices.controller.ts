import type { Request, Response } from 'express';
import type { InvoiceStatus } from '@/generated/prisma/client';
import { listInvoices } from '../services';
import { sendInvoiceError } from './controller.utils';

const listInvoicesController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const query = {
      page: request.query.page ? Number(request.query.page) : 1,
      limit: request.query.limit ? Number(request.query.limit) : 10,
      status: typeof request.query.status === 'string' ? request.query.status as InvoiceStatus : undefined,
      customer_id: request.query.customer_id ? Number(request.query.customer_id) : undefined,
    };
    const invoices = await listInvoices(query);
    return response.status(200).json({ success: true, message: 'Invoices fetched successfully', data: invoices });
  } catch (error) {
    return sendInvoiceError(response, error, 'Unknown error while fetching invoices');
  }
};

export { listInvoicesController };
