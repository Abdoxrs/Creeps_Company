import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById,
  hasEmployeeDependents
} from '../Services/employees.service.js';
import { deleteDependentsByEmployeeId } from '../Services/dependents.service.js';

const createEmp = asyncHandler(async (req, res) => {
  const employee = await createEmployee(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Employee created successfully',
    data: employee
  });
});

const GetAllEmps = asyncHandler(async (req, res) => {
  const allEmployees = await getEmployees(req.query);
  res.status(200).json(allEmployees);
});

const GetEmp = asyncHandler(async (req, res) => {
  const matched = await getEmployeeById(req.params.id);
  if (!matched) throw new ApiError('Employee not found', 404);
  res.status(200).json(matched);
});

const updateEmp = asyncHandler(async (req, res) => {
  const target = await updateEmployee(req.params.id, req.body);
  if (!target) throw new ApiError('Employee not found', 404);
  res.status(200).json(target);
});

const deleteEmp = asyncHandler(async (req, res) => {
  const employee = await getEmployeeById(req.params.id);
  if (!employee) throw new ApiError('Employee not found', 404);
  
  const cascade = req.query.cascade === 'true';
  
  if (cascade) {
    await deleteDependentsByEmployeeId(req.params.id);
    await deleteEmployeeById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Employee and their dependents deleted successfully',
      employee
    });
  } else {
    const hasDependents = await hasEmployeeDependents(req.params.id);
    
    if (hasDependents) {
      throw new ApiError(
        'Cannot delete employee with dependents. Use ?cascade=true to delete employee and dependents together.',
        409
      );
    }
    
    await deleteEmployeeById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully',
      employee
    });
  }
});

export {
  createEmp,
  GetAllEmps,
  GetEmp,
  updateEmp,
  deleteEmp
};