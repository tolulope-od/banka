import { Router } from 'express';
import AccountController from '../controllers/AccountController';
import Authorization from '../middleware/Authorization';
import AccountValidation from '../validation/accountValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const {
  fetchAllAccounts,
  createAccount,
  editAccountStatus,
  getSingleAccount,
  deleteAccount,
  getTransactionHistory
} = AccountController;
const {
  validateAccountCreation,
  validateEditAccount,
  validateGetSingleAccount,
  validateGetAccounts
} = AccountValidation;
const { checkToken } = Authorization;

router.get('/', checkToken, validateGetAccounts, asyncErrorHandler(fetchAllAccounts));
router.post('/', checkToken, validateAccountCreation, asyncErrorHandler(createAccount));
router.patch(
  '/:accountNumber',
  checkToken,
  validateEditAccount,
  asyncErrorHandler(editAccountStatus)
);
router.get(
  '/:accountNumber',
  checkToken,
  validateGetSingleAccount,
  asyncErrorHandler(getSingleAccount)
);
router.get(
  '/:accountNumber/transactions',
  checkToken,
  validateGetSingleAccount,
  asyncErrorHandler(getTransactionHistory)
);
router.delete(
  '/:accountNumber',
  checkToken,
  validateGetSingleAccount,
  asyncErrorHandler(deleteAccount)
);

export default router;
