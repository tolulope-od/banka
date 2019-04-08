import { Router } from 'express';
import TransactionController from '../dummyControllers/TransactionController';
import Authorization from '../middleware/Authorization';
import AccountValidation from '../validation/accountValidation';
import TransactionValidation from '../validation/transactionValidation';

const router = Router();

const { creditAccount, debitAccount } = TransactionController;
const { checkToken } = Authorization;
const { validateCreditTransaction, validateDebitTransaction } = TransactionValidation;
const { validateGetSingleAccount } = AccountValidation;

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
