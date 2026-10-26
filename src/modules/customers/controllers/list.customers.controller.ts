import type { Request, Response } from 'express';
import { listCustomers } from '@/modules/customers/services/list.customers';

const listCustomersController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const query = {
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined,
      search: typeof request.query.search === 'string' ? request.query.search : undefined,
      is_active: typeof request.query.is_active === 'string' ? request.query.is_active === 'true' : undefined,
    };

    const customers = await listCustomers(query);

    return response.status(200).json({
      success: true,
      message: 'Customers fetched successfully',
      data: customers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching customers';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { listCustomersController };
