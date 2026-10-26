import type { Request, Response } from 'express';
import { getInvoice } from '../services';
import { sendInvoiceError } from './controller.utils';

const getInvoiceController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const invoice = await getInvoice(Number(request.params.id));
    return response.status(200).json({ success: true, message: 'Invoice fetched successfully', data: invoice });
  } catch (error) {
    return sendInvoiceError(response, error, 'Unknown error while fetching invoice');
  }
};

export { getInvoiceController };
