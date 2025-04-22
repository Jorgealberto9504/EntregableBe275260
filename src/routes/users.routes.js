import { Router } from 'express';
import { registerUser } from '../controllers/users.controller.js';
import { loginUser } from '../controllers/users.controller.js';
import { getProfile } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
import passport from 'passport';
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile)

export default router;