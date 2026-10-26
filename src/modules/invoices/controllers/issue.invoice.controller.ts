import type { Request, Response } from 'express';
import { issueInvoice } from '../services';
import { sendInvoiceError } from './controller.utils';

const issueInvoiceController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const invoice = await issueInvoice(Number(request.params.id));
    return response.status(200).json({ success: true, message: 'Invoice issued successfully', data: invoice });
  } catch (error) {
    return sendInvoiceError(response, error, 'Unknown error while issuing invoice');
  }
};

export { issueInvoiceController };
