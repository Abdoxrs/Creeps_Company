import express from 'express';
import { 
  createEmp, 
  GetAllEmps, 
  GetEmp, 
  updateEmp, 
  deleteEmp, 
} from '../Controllers/employees.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);

router.get('/', GetAllEmps);
router.get('/:id', GetEmp);

router.post('/', restrictTo('admin'), createEmp);
router.patch('/:id', restrictTo('admin'), updateEmp);
router.delete('/:id', restrictTo('admin'), deleteEmp);

export default router;