import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthValidation from '../validation/authValidation';
import asyncErrorHandler from '../middleware/asyncErrorHandler';

const router = Router();

const { signUp, signIn } = AuthController;
const { validateUserSignup, validateUserLogIn } = AuthValidation;

router.post('/signup', validateUserSignup, asyncErrorHandler(signUp));
router.post('/signin', validateUserLogIn, asyncErrorHandler(signIn));

export default router;
