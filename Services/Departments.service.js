import Department from '../Models/departments.model.js'
import ApiFeatures from '../utilities/ApiFeatures.js';

const createDepartment = (data) => Department.create(data);

const getDepartments = (queryParams) => {
  const apiFeature = new ApiFeatures(Department.find({}), queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  return apiFeature.dbQuery;
};

const getDepartmentById = (id) => Department.findById(id);

const updateDepartment = (id,updated) => {
  return Department.findByIdAndUpdate(id,updated,{new: true, runValidators: true})
}

const deleteDepartments = () => Department.deleteMany({})

const deleteDepartmentById = (id) => Department.findByIdAndDelete(id);

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartments,
  deleteDepartmentById
};