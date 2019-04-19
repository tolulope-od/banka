import { Router } from 'express';
import authRoutes from './AuthRoute';
import accountRoutes from './AccountRoute';
import transactionRoutes from './TransactionRoute';
import userRoutes from './UserRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/user', userRoutes);

export default router;
