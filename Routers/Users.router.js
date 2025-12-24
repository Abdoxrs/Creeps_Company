import express from 'express';
import {
  CreateUser, 
  GetAllUsers, 
  GetUser,
  UpdateUser,
  DeleteUser
} from '../Controllers/Users.controller.js';

const router = express.Router();

router.post('/',CreateUser);

router.get('/',GetAllUsers);
router.get('/:id',GetUser);

router.patch('/:id',UpdateUser);

router.delete('/:id',DeleteUser)

export default router;