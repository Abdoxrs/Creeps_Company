import Dependent from '../Models/dependents.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

const createDependent = (data) => Dependent.create(data);

const getDependents = (queryParams) => {
  const query = Dependent.find({}).populate('employeeId', 'ssn name');
  const apiFeature = new ApiFeatures(query, queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  return apiFeature.dbQuery;
};

const getDependentById = (id) => Dependent.findById(id).populate('employeeId', 'ssn name');

const updateDependent = (id, updated) => {
  return Dependent.findByIdAndUpdate(id, updated, { new: true, runValidators: true }).populate('employeeId', 'ssn name');
};

const deleteDependentById = (id) => Dependent.findByIdAndDelete(id);

export {
  createDependent,
  getDependents,
  getDependentById,
  updateDependent,
  deleteDependentById
};