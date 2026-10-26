
import { Router } from 'express';

import customerRoutes from '@/modules/customers/customer.routes';

const router = Router();

router.use('/customers', customerRoutes);

export default router;
