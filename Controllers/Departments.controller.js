import ApiError from '../utilities/ApiError.js'
import asyncHandler from '../utilities/asyncHandler.js';
import {
  createDepartment, 
  getDepartments, 
  getDepartmentById,
  updateDepartment, 
  deleteDepartments,
  deleteDepartmentById
} from '../Services/departments.service.js';

const CreateDepartment = asyncHandler(async (req, res) => {
  const createdDep = await createDepartment(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Department created successfully',
    data: createdDep
  });
});

const GetAllDepartments = asyncHandler(async (req, res) => {
  let alldeps = await getDepartments(req.query)
  res.status(200).json(alldeps);
});

const GetDepartment = asyncHandler(async (req, res) => {
  const matched = await getDepartmentById(req.params.id)
  if (!matched) throw new ApiError('Department not found', 404);
  res.status(200).json(matched);
});

const UpdateDepartment = asyncHandler(async (req, res) => {
  try {
    const target = await updateDepartment(req.params.id, req.body);
    if (!target) throw new ApiError('Department not found', 404);
    res.status(200).json(target);
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError('Department number already exists', 409);
    }
    throw error;
  }
});

const DeleteDepartments = asyncHandler(async (req, res) => {
  const alldeleted = await deleteDepartments();
  res.status(200).json(alldeleted)
});

const DeleteOneDepartment = asyncHandler(async (req, res) => {
  const deletedOne = await deleteDepartmentById(req.params.id);    
  if (!deletedOne) throw new ApiError('Department not found', 404);
  res.status(200).json({ 
    status: 'success',
    message: 'Department deleted successfully', 
    department: deletedOne 
  });
});

export {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, 
  UpdateDepartment,
  DeleteDepartments,
  DeleteOneDepartment
};