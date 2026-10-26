import type { Request, Response } from 'express';
import { createInvoice } from '../services';
import { sendInvoiceError } from './controller.utils';

const createInvoiceController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const invoice = await createInvoice(request.body);
    return response.status(201).json({ success: true, message: 'Draft invoice created successfully', data: invoice });
  } catch (error) {
    return sendInvoiceError(response, error, 'Unknown error while creating invoice');
  }
};

export { createInvoiceController };
