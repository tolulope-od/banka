import { Router } from 'express';
import AccountController from '../dummyControllers/AccountController';
import Authorization from '../middleware/Authorization';
import { validateAccountCreation, validateEditAccount } from '../validation/accountValidation';

const router = Router();

const { fetchAllAccounts, createAccount, editAccountStatus } = AccountController;
const { checkToken } = Authorization;

router.get('/', checkToken, fetchAllAccounts);
router.post('/', checkToken, validateAccountCreation, createAccount);
router.patch('/:accountNumber', checkToken, validateEditAccount, editAccountStatus);

export default router;
