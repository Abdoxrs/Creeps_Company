import express from 'express';
import {
  CreateDependent, 
  GetAllDependents, 
  GetDependent,
  UpdateDependent,
  DeleteDependent
} from '../Controllers/Departments.controller.js';

const router = express.Router();

router.post('/', CreateDependent);

router.get('/', GetAllDependents);
router.get('/:id', GetDependent);

router.patch('/:id', UpdateDependent);

router.delete('/:id', DeleteDependent);

export default router;