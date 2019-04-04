import { Router } from 'express';
import AuthController from '../dummyControllers/AuthController';
import { validateUserSignup } from '../validation/authValidation';

const router = Router();

const { signUp } = AuthController;

router.post('/signup', validateUserSignup, signUp);

export default router;
