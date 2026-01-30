import express from 'express';
import {
  CreateProject, 
  GetAllProjects, 
  GetProject,
  UpdateProject,
  DeleteProject
} from '../Controllers/projects.controller.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);

router.get('/', GetAllProjects);
router.get('/:id', GetProject);


router.post('/', restrictTo('admin'), CreateProject);
router.patch('/:id', restrictTo('admin'), UpdateProject);
router.delete('/:id', restrictTo('admin'), DeleteProject);

export default router;