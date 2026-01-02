import express from 'express';
import {
  CreateUser,
  Login, 
  FindUser,
  UpdateUserProfile,
  ChangePassword
} from '../Controllers/Users.controller.js';

const router = express.Router();

router.post('/signup', CreateUser);
router.post('/login', Login);

router.get('/:id', FindUser);

router.patch('/:id/profile', UpdateUserProfile);
router.patch('/:id/password', ChangePassword);

export default router;