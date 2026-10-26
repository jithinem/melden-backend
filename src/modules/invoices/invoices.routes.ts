import { Router } from 'express';
import {
  createInvoiceController,
  createPaymentController,
  getInvoiceController,
  issueInvoiceController,
  listInvoicesController,
} from './controllers';
import {
  createInvoiceValidation,
  createPaymentValidation,
  listInvoicesValidation,
  validateInvoiceId,
} from './invoices.validation';

const invoiceRoutes = Router();

invoiceRoutes.post('/invoices', createInvoiceValidation, createInvoiceController);
invoiceRoutes.get('/invoices', listInvoicesValidation, listInvoicesController);
invoiceRoutes.get('/invoices/:id', validateInvoiceId, getInvoiceController);
invoiceRoutes.post('/invoices/:id/issue', validateInvoiceId, issueInvoiceController);
invoiceRoutes.post('/payments', createPaymentValidation, createPaymentController);

export default invoiceRoutes;
