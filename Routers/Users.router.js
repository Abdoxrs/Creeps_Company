import express from 'express';
import {
  CreateUser,
  Login, 
  FindUser,
  UpdateUserProfile,
  ChangePassword
} from '../Controllers/users.controller.js';

const router = express.Router();

router.post('/signup', CreateUser);
router.post('/login', Login);

router.get('/:id', FindUser);

// ✅ New routes
router.patch('/:id/profile', UpdateUserProfile);  // Update email, etc.
router.patch('/:id/password', ChangePassword);     // Change password

export default router;