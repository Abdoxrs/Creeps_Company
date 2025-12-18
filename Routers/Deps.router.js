import express from 'express';
import {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment,
  UpdateDepartment,
  DeleteDepartment
} from '../Controllers/Deps.controller.js';

const router = express.Router();

router.post('/',CreateDepartment);

router.get('/',GetAllDepartments);
router.get('/:id',GetDepartment);

router.patch('/:id',UpdateDepartment);

router.delete('/:id',DeleteDepartment)

export default router;