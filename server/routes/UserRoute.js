import { Router } from 'express';
import UserController from '../controllers/UserController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../validation/userValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const { fetchAllAccountsByUser } = UserController;
const { checkToken } = Authorization;
const { validateFetchUsersAccounts } = UserValidation;

router.get(
  '/:userEmail/accounts',
  checkToken,
  validateFetchUsersAccounts,
  asyncErrorHandler(fetchAllAccountsByUser)
);

export default router;
