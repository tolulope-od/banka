import { Router } from 'express';
import AccountController from '../dummyControllers/AccountController';
import Authorization from '../middleware/Authorization';
import AccountValidation from '../validation/accountValidation';

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

router.get('/', checkToken, fetchAllAccounts);
router.post('/', checkToken, validateAccountCreation, createAccount);
router.patch('/:accountNumber', checkToken, validateEditAccount, editAccountStatus);
router.get('/:accountNumber', checkToken, validateGetSingleAccount, getSingleAccount);
router.delete('/:accountNumber', checkToken, validateGetSingleAccount, deleteAccount);

export default router;
