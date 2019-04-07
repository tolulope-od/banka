import { Router } from 'express';
import AccountController from '../dummyControllers/AccountController';
import Authorization from '../middleware/Authorization';
import {
  validateAccountCreation,
  validateEditAccount,
  validateGetSingleAccount
} from '../validation/accountValidation';

const router = Router();

const { fetchAllAccounts, createAccount, editAccountStatus, getSingleAccount } = AccountController;
const { checkToken } = Authorization;

router.get('/', checkToken, fetchAllAccounts);
router.post('/', checkToken, validateAccountCreation, createAccount);
router.patch('/:accountNumber', checkToken, validateEditAccount, editAccountStatus);
router.get('/:accountNumber', checkToken, validateGetSingleAccount, getSingleAccount);

export default router;
