import Employee from '../Models/employees.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

const createEmployee = (data) => Employee.create(data);

const getEmployees = (queryParams) => {
  const apiFeature = new ApiFeatures(Employee.find({}), queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  return apiFeature.dbQuery;
};

const getEmployeeById = (id) => Employee.findById(id);

const updateEmployee = (id, updated) => {
  return Employee.findByIdAndUpdate(id, updated, { new: true, runValidators: true });
};

const deleteEmployeeById = (id) => Employee.findByIdAndDelete(id);

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById
};