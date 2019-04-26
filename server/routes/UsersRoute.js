import { Router } from 'express';
import UserController from '../controllers/UserController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../validation/userValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const { createStaff } = UserController;
const { checkToken } = Authorization;
const { validateCreateStaff } = UserValidation;

router.post('/', checkToken, validateCreateStaff, asyncErrorHandler(createStaff));

export default router;
