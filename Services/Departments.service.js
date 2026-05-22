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

const updateDepartment = async (id, updated) => {
  const department = await Department.findById(id);
  if (!department) return null;
  
  Object.assign(department, updated);
  return await department.save();
};

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