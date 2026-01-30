import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';
import {
  assignEmployeeToProject,
  getWorkAssignments,
  getWorkAssignmentById,
  updateWorkAssignment,
  deleteWorkAssignment,
  getEmployeesOnProject,
  getEmployeeProjects
} from '../Services/worksOn.service.js';


export const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignEmployeeToProject(req.body);
  
  res.status(201).json({
    status: 'success',
    message: 'Employee assigned to project successfully',
    data: assignment
  });
});


export const getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await getWorkAssignments(req.query);
  
  res.status(200).json({
    status: 'success',
    results: assignments.length,
    data: assignments
  });
});


export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await getWorkAssignmentById(req.params.id);
  
  if (!assignment) {
    throw new ApiError('Assignment not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: assignment
  });
});


export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await updateWorkAssignment(req.params.id, req.body);
  
  if (!assignment) {
    throw new ApiError('Assignment not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Assignment updated successfully',
    data: assignment
  });
});


export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await deleteWorkAssignment(req.params.id);
  
  if (!assignment) {
    throw new ApiError('Assignment not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Assignment deleted successfully',
    data: assignment
  });
});


export const getProjectEmployees = asyncHandler(async (req, res) => {
  const employees = await getEmployeesOnProject(req.params.projectId);
  
  res.status(200).json({
    status: 'success',
    results: employees.length,
    data: employees
  });
});


export const getEmployeeProjectsList = asyncHandler(async (req, res) => {
  const projects = await getEmployeeProjects(req.params.employeeId);
  
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: projects
  });
});