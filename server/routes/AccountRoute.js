import { Router } from 'express';
import AccountController from '../dummyControllers/AccountController';
import Authorization from '../middleware/Authorization';
import validateAccountCreation from '../validation/accountValidation';

const router = Router();

const { fetchAllAccounts, createAccount } = AccountController;
const { checkToken } = Authorization;

router.get('/', checkToken, fetchAllAccounts);
router.post('/', checkToken, validateAccountCreation, createAccount);

export default router;
