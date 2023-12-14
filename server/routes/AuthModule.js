import express from 'express';
const router = express.Router();
import {registration, confirmMail, login, logout, resetpassword, resetpasswordToken} from '../controllers/authController.js';

router.post('/register', registration);
router.get('/confirmation/:token', confirmMail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/password-reset', resetpassword);
router.post('/password-reset/:token', resetpasswordToken);

export default router;
