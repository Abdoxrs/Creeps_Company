import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  getProjectEmployees,
  getEmployeeProjectsList
} from '../Controllers/worksOn.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);


router.post('/', restrictTo('admin'), createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignment);
router.patch('/:id', restrictTo('admin'), updateAssignment);
router.delete('/:id', restrictTo('admin'), deleteAssignment);


router.get('/project/:projectId/employees', getProjectEmployees);
router.get('/employee/:employeeId/projects', getEmployeeProjectsList);

export default router;