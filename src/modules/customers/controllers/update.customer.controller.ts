import type { Request, Response } from 'express';
import { updateCustomer } from '@/modules/customers/services/update.customer';

const updateCustomerController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const customer = await updateCustomer(Number(request.params.id), request.body);
    return response.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while updating customer';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { updateCustomerController };
