import { Router } from 'express';
import {
  listCustomersController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from '@/modules/customers/controllers';
import { createCustomerValidation, updateCustomerValidation, listCustomersValidation } from '@/modules/customers/customers.validation';

const customerRoutes = Router();

customerRoutes.get('/', listCustomersValidation, listCustomersController);
customerRoutes.post('/', createCustomerValidation, createCustomerController);
// customerRoutes.put('/:id', updateCustomerValidation, updateCustomerController);
// customerRoutes.delete('/:id', deleteCustomerController);

export default customerRoutes;
