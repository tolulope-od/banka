import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';
import Authorization from '../middleware/Authorization';
import AccountValidation from '../validation/accountValidation';
import TransactionValidation from '../validation/transactionValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

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
  asyncErrorHandler(creditAccount)
);
router.post(
  '/:accountNumber/debit',
  checkToken,
  validateGetSingleAccount,
  validateDebitTransaction,
  asyncErrorHandler(debitAccount)
);

export default router;
