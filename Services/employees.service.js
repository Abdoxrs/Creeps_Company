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

const updateEmployee = async (id, updated) => {
  const employee = await Employee.findById(id);
  if (!employee) return null;
  
  Object.assign(employee, updated);
  return await employee.save();
};

const deleteEmployeeById = (id) => Employee.findByIdAndDelete(id);

const hasEmployeeDependents = async (employeeId) => {
  const Dependent = (await import('../Models/dependents.model.js')).default;
  const count = await Dependent.countDocuments({ employeeId });
  return count > 0;
};

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById,
  hasEmployeeDependents
};