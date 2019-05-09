import { Router } from 'express';
import UserController from '../controllers/UserController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../validation/userValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const { adminAddStaff, createStaff, getAllStaff } = UserController;
const { checkToken } = Authorization;
const { validateAddStaff, validateCreateStaff } = UserValidation;
router.get('/', checkToken, asyncErrorHandler(getAllStaff));
router.patch('/', checkToken, validateAddStaff, asyncErrorHandler(adminAddStaff));
router.post('/', checkToken, validateCreateStaff, asyncErrorHandler(createStaff));

export default router;
