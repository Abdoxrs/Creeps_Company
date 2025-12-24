import ApiError from '../utilities/ApiError.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProjectById
} from '../Services/projects.service.js';

async function CreateProject(req, res, next) {
  const project = await createProject(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Project created successfully',
    data: project
  });
}

async function GetAllProjects(req, res, next) {
  const allProjects = await getProjects(req.query);
  res.status(200).json(allProjects);
}

async function GetProject(req, res, next) {
  const matched = await getProjectById(req.params.id);
  if (!matched) throw new ApiError('Project not found', 404);
  res.status(200).json(matched);
}

async function UpdateProject(req, res, next) {
  const target = await updateProject(req.params.id, req.body);
  if (!target) throw new ApiError('Project not found', 404);
  res.status(200).json(target);
}

async function DeleteProject(req, res, next) {
  const deletedOne = await deleteProjectById(req.params.id);
  if (!deletedOne) throw new ApiError('Project not found', 404);
  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully',
    project: deletedOne
  });
}

export {
  CreateProject,
  GetAllProjects,
  GetProject,
  UpdateProject,
  DeleteProject
};