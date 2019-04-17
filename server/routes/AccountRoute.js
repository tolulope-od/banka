import { Router } from 'express';
import AccountController from '../dummyControllers/AccountController';
import PrimaryAccountController from '../controllers/AccountController';
import Authorization from '../middleware/Authorization';
import AccountValidation from '../validation/accountValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const {
  fetchAllAccounts,
  // createAccount,
  // editAccountStatus,
  getSingleAccount
  // deleteAccount
} = AccountController;
const {
  validateAccountCreation,
  validateEditAccount,
  validateGetSingleAccount
} = AccountValidation;
const { checkToken } = Authorization;

router.get('/', checkToken, fetchAllAccounts);
router.post(
  '/',
  checkToken,
  validateAccountCreation,
  asyncErrorHandler(PrimaryAccountController.createAccount)
);
router.patch(
  '/:accountNumber',
  checkToken,
  validateEditAccount,
  asyncErrorHandler(PrimaryAccountController.editAccountStatus)
);
router.get('/:accountNumber', checkToken, validateGetSingleAccount, getSingleAccount);
router.delete(
  '/:accountNumber',
  checkToken,
  validateGetSingleAccount,
  asyncErrorHandler(PrimaryAccountController.deleteAccount)
);

export default router;
