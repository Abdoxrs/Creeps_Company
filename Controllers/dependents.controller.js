import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';
import {
  createDependent,
  getDependents,
  getDependentById,
  updateDependent,
  deleteDependentById
} from '../Services/dependents.service.js';

const CreateDependent = asyncHandler(async (req, res) => {
  const dependent = await createDependent(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Dependent created successfully',
    data: dependent
  });
});

const GetAllDependents = asyncHandler(async (req, res) => {
  const allDependents = await getDependents(req.query);
  res.status(200).json(allDependents);
});

const GetDependent = asyncHandler(async (req, res) => {
  const matched = await getDependentById(req.params.id);
  if (!matched) throw new ApiError('Dependent not found', 404);
  res.status(200).json(matched);
});

const UpdateDependent = asyncHandler(async (req, res) => {
  const target = await updateDependent(req.params.id, req.body);
  if (!target) throw new ApiError('Dependent not found', 404);
  res.status(200).json(target);
});

const DeleteDependent = asyncHandler(async (req, res) => {
  const deletedOne = await deleteDependentById(req.params.id);
  if (!deletedOne) throw new ApiError('Dependent not found', 404);
  res.status(200).json({
    status: 'success',
    message: 'Dependent deleted successfully',
    dependent: deletedOne
  });
});

export {
  CreateDependent,
  GetAllDependents,
  GetDependent,
  UpdateDependent,
  DeleteDependent
};