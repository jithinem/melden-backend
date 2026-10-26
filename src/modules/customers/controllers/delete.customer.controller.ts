import type { Request, Response } from 'express';
import { deleteCustomer } from '@/modules/customers/services/delete.customer';

const deleteCustomerController = async (request: Request, response: Response): Promise<Response> => {
  try {
    await deleteCustomer(Number(request.params.id));
    return response.status(200).json({ success: true, message: 'Customer deleted successfully', data: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while deleting customer';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { deleteCustomerController };
