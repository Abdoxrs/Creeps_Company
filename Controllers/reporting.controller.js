import asyncHandler from '../utilities/asyncHandler.js';
import {
  getEmployeeStatsByDepartment,
  getTotalHoursPerProject,
  getTotalHoursPerEmployee,
  getDepartmentSummary,
  getEmployeesWithoutSupervisor,
  getTopSupervisors,
  getUnstaffedProjects
} from '../Services/reporting.service.js';

export const employeeStatsByDept = asyncHandler(async (req, res) => {
  const stats = await getEmployeeStatsByDepartment();
  
  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: stats
  });
});

export const hoursPerProject = asyncHandler(async (req, res) => {
  const stats = await getTotalHoursPerProject();
  
  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: stats
  });
});

export const hoursPerEmployee = asyncHandler(async (req, res) => {
  const stats = await getTotalHoursPerEmployee();
  
  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: stats
  });
});

export const departmentSummary = asyncHandler(async (req, res) => {
  const summary = await getDepartmentSummary(req.params.id);
  
  if (!summary || summary.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'Department not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: summary[0]
  });
});

export const employeesWithoutSupervisor = asyncHandler(async (req, res) => {
  const employees = await getEmployeesWithoutSupervisor();
  
  res.status(200).json({
    status: 'success',
    results: employees.length,
    data: employees
  });
});

export const topSupervisors = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const supervisors = await getTopSupervisors(limit);
  
  res.status(200).json({
    status: 'success',
    results: supervisors.length,
    data: supervisors
  });
});

export const unstaffedProjects = asyncHandler(async (req, res) => {
  const projects = await getUnstaffedProjects();
  
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: projects
  });
});