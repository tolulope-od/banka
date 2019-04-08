import { Router } from 'express';
import AuthController from '../dummyControllers/AuthController';
import AuthValidation from '../validation/authValidation';

const router = Router();

const { signUp, signIn } = AuthController;
const { validateUserSignup, validateUserLogIn } = AuthValidation;

router.post('/signup', validateUserSignup, signUp);
router.post('/signin', validateUserLogIn, signIn);

export default router;
