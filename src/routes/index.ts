
import { Router } from 'express';

import customerRoutes from '@/modules/customers/customer.routes';
import invoiceRoutes from '@/modules/invoices/invoices.routes';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/', invoiceRoutes);

export default router;
