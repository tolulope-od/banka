import { Router } from 'express';
import UserController from '../controllers/UserController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../validation/userValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const { fetchAllAccountsByUser, adminAddStaff } = UserController;
const { checkToken } = Authorization;
const { validateFetchUsersAccounts, validateAddStaff } = UserValidation;

router.get(
  '/:userEmail/accounts',
  checkToken,
  validateFetchUsersAccounts,
  asyncErrorHandler(fetchAllAccountsByUser)
);

router.patch('/', checkToken, validateAddStaff, asyncErrorHandler(adminAddStaff));

export default router;
