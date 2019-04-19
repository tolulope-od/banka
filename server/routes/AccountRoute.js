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
  deleteAccount
} = AccountController;
const {
  validateAccountCreation,
  validateEditAccount,
  validateGetSingleAccount
} = AccountValidation;
const { checkToken } = Authorization;

router.get('/', checkToken, asyncErrorHandler(fetchAllAccounts));
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
router.delete(
  '/:accountNumber',
  checkToken,
  validateGetSingleAccount,
  asyncErrorHandler(deleteAccount)
);

export default router;
