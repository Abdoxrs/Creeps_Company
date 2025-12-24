import ApiError from '../utilities/ApiError.js';
import {
  createDependent,
  getDependents,
  getDependentById,
  updateDependent,
  deleteDependentById
} from '../Services/dependents.service.js';

async function CreateDependent(req, res, next) {
  const dependent = await createDependent(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Dependent created successfully',
    data: dependent
  });
}

async function GetAllDependents(req, res, next) {
  const allDependents = await getDependents(req.query);
  res.status(200).json(allDependents);
}

async function GetDependent(req, res, next) {
  const matched = await getDependentById(req.params.id);
  if (!matched) throw new ApiError('Dependent not found', 404);
  res.status(200).json(matched);
}

async function UpdateDependent(req, res, next) {
  const target = await updateDependent(req.params.id, req.body);
  if (!target) throw new ApiError('Dependent not found', 404);
  res.status(200).json(target);
}

async function DeleteDependent(req, res, next) {
  const deletedOne = await deleteDependentById(req.params.id);
  if (!deletedOne) throw new ApiError('Dependent not found', 404);
  res.status(200).json({
    status: 'success',
    message: 'Dependent deleted successfully',
    dependent: deletedOne
  });
}

export {
  CreateDependent,
  GetAllDependents,
  GetDependent,
  UpdateDependent,
  DeleteDependent
};