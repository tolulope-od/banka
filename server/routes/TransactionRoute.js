import { Router } from 'express';
import TransactionController from '../dummyControllers/TransactionController';
import Authorization from '../middleware/Authorization';
import { validateGetSingleAccount } from '../validation/accountValidation';
import { validateCreditTransaction, validateDebitTransaction } from '../validation/transactionValidation';

const router = Router();

const { creditAccount, debitAccount } = TransactionController;
const { checkToken } = Authorization;

router.post(
  '/:accountNumber/credit',
  checkToken,
  validateGetSingleAccount,
  validateCreditTransaction,
  creditAccount
);
router.post(
  '/:accountNumber/debit',
  checkToken,
  validateGetSingleAccount,
  validateDebitTransaction,
  debitAccount
);

export default router;
