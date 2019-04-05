import { Router } from 'express';
import AuthController from '../dummyControllers/AuthController';
import { validateUserSignup, validateUserLogIn } from '../validation/authValidation';

const router = Router();

const { signUp, signIn } = AuthController;

router.post('/signup', validateUserSignup, signUp);
router.post('/signin', validateUserLogIn, signIn);

export default router;
