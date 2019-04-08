import { Router } from 'express';
import TransactionController from '../dummyControllers/TransactionController';
import Authorization from '../middleware/Authorization';
import { validateGetSingleAccount } from '../validation/accountValidation';
import { validateCreditTransaction } from '../validation/transactionValidation';

const router = Router();

const { creditAccount } = TransactionController;
const { checkToken } = Authorization;

router.post(
  '/:accountNumber/credit',
  checkToken,
  validateGetSingleAccount,
  validateCreditTransaction,
  creditAccount
);

export default router;
