import { Router } from 'express';
import { registerUser } from '../controllers/users.controller.js';
import { loginUser } from '../controllers/users.controller.js';
import { getProfile } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { updateUser, deleteUser } from '../controllers/users.controller.js';
import passport from 'passport';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile)

// Actualizar usuario
router.put('/email/:email', passport.authenticate('jwt', { session: false }), updateUser);

// Eliminar usuario
router.delete('/email/:email', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;