import express from 'express';
import {
  CreateDependent, 
  GetAllDependents, 
  GetDependent,
  UpdateDependent,
  DeleteDependent
} from '../Controllers/dependents.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);


router.get('/', GetAllDependents);
router.get('/:id', GetDependent);

router.post('/', restrictTo('admin'), CreateDependent);
router.patch('/:id', restrictTo('admin'), UpdateDependent);
router.delete('/:id', restrictTo('admin'), DeleteDependent);

export default router;