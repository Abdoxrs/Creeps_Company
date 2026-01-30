import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../Controllers/auth.controller.js';
import {
  getAllUsers,
  getUser,
  getMe,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser
} from '../Controllers/users.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);


router.use(protect);


router.get('/me', getMe, getUser);
router.patch('/me', updateMe);
router.delete('/me', deleteMe);
router.patch('/update-password', updatePassword);


router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;