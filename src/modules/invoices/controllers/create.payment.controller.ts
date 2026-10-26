import type { Request, Response } from 'express';
import { createPayment } from '../services';
import { sendInvoiceError } from './controller.utils';

const createPaymentController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const payment = await createPayment(request.body);
    return response.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    return sendInvoiceError(response, error, 'Unknown error while recording payment');
  }
};

export { createPaymentController };
