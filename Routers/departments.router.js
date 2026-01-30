import express from 'express';
import {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, 
  UpdateDepartment,
  DeleteDepartments,
  DeleteOneDepartment
} from '../Controllers/departments.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);

router.get('/', GetAllDepartments);
router.get('/:id', GetDepartment);


router.post('/', restrictTo('admin'), CreateDepartment);
router.patch('/:id', restrictTo('admin'), UpdateDepartment);
router.delete('/', restrictTo('admin'), DeleteDepartments);
router.delete('/:id', restrictTo('admin'), DeleteOneDepartment);

export default router;