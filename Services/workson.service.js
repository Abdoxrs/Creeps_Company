import WorksOn from '../Models/worksOn.model.js';
import Employee from '../Models/employees.model.js';
import Project from '../Models/projects.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';
import { validateDocumentExists } from '../utilities/validators.js';


const assignEmployeeToProject = async (data) => {
  await validateDocumentExists(Employee, data.employeeId, 'Employee');
  await validateDocumentExists(Project, data.projectId, 'Project');
  
  return WorksOn.create(data);
};


const getWorkAssignments = (queryParams) => {
  const query = WorksOn.find({})
    .populate('employeeId', 'ssn name salary')
    .populate('projectId', 'number name location');
  
  const apiFeature = new ApiFeatures(query, queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  
  return apiFeature.dbQuery;
};


const getWorkAssignmentById = (id) => {
  return WorksOn.findById(id)
    .populate('employeeId', 'ssn name salary')
    .populate('projectId', 'number name location');
};


const updateWorkAssignment = async (id, updated) => {
  if (updated.employeeId) {
    await validateDocumentExists(Employee, updated.employeeId, 'Employee');
  }
  
  if (updated.projectId) {
    await validateDocumentExists(Project, updated.projectId, 'Project');
  }
  
  return WorksOn.findByIdAndUpdate(id, updated, {
    new: true,
    runValidators: true
  })
    .populate('employeeId', 'ssn name salary')
    .populate('projectId', 'number name location');
};


const deleteWorkAssignment = (id) => WorksOn.findByIdAndDelete(id);


const deleteEmployeeAssignments = (employeeId) => {
  return WorksOn.deleteMany({ employeeId });
};


const deleteProjectAssignments = (projectId) => {
  return WorksOn.deleteMany({ projectId });
};

const getEmployeesOnProject = (projectId) => {
  return WorksOn.find({ projectId })
    .populate('employeeId', 'ssn name salary');
};


const getEmployeeProjects = (employeeId) => {
  return WorksOn.find({ employeeId })
    .populate('projectId', 'number name location');
};


const getTotalProjectHours = async (projectId) => {
  const result = await WorksOn.aggregate([
    { $match: { projectId } },
    { $group: { _id: null, totalHours: { $sum: '$hours' } } }
  ]);
  
  return result.length > 0 ? result[0].totalHours : 0;
};


const getTotalEmployeeHours = async (employeeId) => {
  const result = await WorksOn.aggregate([
    { $match: { employeeId } },
    { $group: { _id: null, totalHours: { $sum: '$hours' } } }
  ]);
  
  return result.length > 0 ? result[0].totalHours : 0;
};

export {
  assignEmployeeToProject,
  getWorkAssignments,
  getWorkAssignmentById,
  updateWorkAssignment,
  deleteWorkAssignment,
  deleteEmployeeAssignments,
  deleteProjectAssignments,
  getEmployeesOnProject,
  getEmployeeProjects,
  getTotalProjectHours,
  getTotalEmployeeHours
};