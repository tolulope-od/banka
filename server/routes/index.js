import { Router } from 'express';
import authRoutes from './AuthRoute';
import accountRoutes from './AccountRoute';
import transactionRoutes from './TransactionRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);

export default router;
