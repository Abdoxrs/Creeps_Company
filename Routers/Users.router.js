import express from 'express';
import {
  CreateUer, Login, FindUser
} from '../Controllers/users.controller.js';

const router = express.Router();

router.post('/signup',CreateUer);
router.post('/login',Login);
router.get('/:id',FindUser);


export default router;