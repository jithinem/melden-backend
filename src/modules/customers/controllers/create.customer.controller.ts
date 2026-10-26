import type { Request, Response } from 'express';
import { createCustomer } from '@/modules/customers/services/create.customer';

const createCustomerController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const customer = await createCustomer(request.body);
    return response.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while creating customer';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { createCustomerController };
