import express from 'express';
import {
  employeeStatsByDept,
  hoursPerProject,
  hoursPerEmployee,
  departmentSummary,
  employeesWithoutSupervisor,
  topSupervisors,
  unstaffedProjects
} from '../Controllers/reporting.controller.js';
import { protect } from '../utilities/protect.js';

const router = express.Router();


router.use(protect);


router.get('/departments/stats', employeeStatsByDept);
router.get('/departments/:id/summary', departmentSummary);


router.get('/projects/hours', hoursPerProject);
router.get('/projects/unstaffed', unstaffedProjects);


router.get('/employees/hours', hoursPerEmployee);
router.get('/employees/without-supervisor', employeesWithoutSupervisor);
router.get('/employees/top-supervisors', topSupervisors);


export default router;