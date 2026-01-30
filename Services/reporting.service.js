import Employee from '../Models/employees.model.js';
import Department from '../Models/departments.model.js';
import Project from '../Models/projects.model.js';
import WorksOn from '../Models/worksOn.model.js';
import mongoose from 'mongoose';


const getEmployeeStatsByDepartment = async () => {
  return Employee.aggregate([
    {
      $lookup: {
        from: 'departments',
        localField: 'deptNo',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$deptNo',
        departmentName: { $first: '$department.name' },
        employeeCount: { $sum: 1 },
        avgSalary: { $avg: '$salary' },
        totalSalary: { $sum: '$salary' },
        minSalary: { $min: '$salary' },
        maxSalary: { $max: '$salary' }
      }
    },
    { $sort: { employeeCount: -1 } }
  ]);
};


const getTotalHoursPerProject = async () => {
  return WorksOn.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    { $unwind: '$project' },
    {
      $group: {
        _id: '$projectId',
        projectName: { $first: '$project.name' },
        projectNumber: { $first: '$project.number' },
        totalHours: { $sum: '$hours' },
        employeeCount: { $sum: 1 }
      }
    },
    { $sort: { totalHours: -1 } }
  ]);
};


const getTotalHoursPerEmployee = async () => {
  return WorksOn.aggregate([
    {
      $lookup: {
        from: 'employees',
        localField: 'employeeId',
        foreignField: '_id',
        as: 'employee'
      }
    },
    { $unwind: '$employee' },
    {
      $group: {
        _id: '$employeeId',
        employeeName: {
          $first: {
            $concat: [
              '$employee.name.fname',
              ' ',
              { $ifNull: ['$employee.name.minit', ''] },
              ' ',
              '$employee.name.lname'
            ]
          }
        },
        ssn: { $first: '$employee.ssn' },
        totalHours: { $sum: '$hours' },
        projectCount: { $sum: 1 }
      }
    },
    { $sort: { totalHours: -1 } }
  ]);
};


const getDepartmentSummary = async (deptId) => {
  const ObjectId = mongoose.Types.ObjectId;
  
  return Department.aggregate([
    { $match: { _id: new ObjectId(deptId) } },
    {
      $lookup: {
        from: 'employees',
        localField: '_id',
        foreignField: 'deptNo',
        as: 'employees'
      }
    },
    {
      $lookup: {
        from: 'employees',
        localField: 'mgrSsn',
        foreignField: 'ssn',
        as: 'manager'
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: 'controllingDept',
        as: 'projects'
      }
    },
    {
      $project: {
        number: 1,
        name: 1,
        locations: 1,
        mgrSsn: 1,
        mgrStartDate: 1,
        manager: { $arrayElemAt: ['$manager', 0] },
        employeeCount: { $size: '$employees' },
        totalSalary: { $sum: '$employees.salary'},
        avgSalary: { $avg: '$employees.salary' },
        projectCount: { $size: '$projects' }
      }
    }
  ]);
};

const getEmployeesWithoutSupervisor = async () => {
  return Employee.find({ superSsn: null })
    .populate('deptNo', 'name number');
};

const getTopSupervisors = async (limit = 10) => {
  return Employee.aggregate([
    {
      $lookup: {
        from: 'employees',
        localField: 'ssn',
        foreignField: 'superSsn',
        as: 'subordinates' // لازم تعديل
      }
    },
    {
      $project: {
        ssn: 1,
        name: 1,
        salary: 1,
        deptNo: 1,
        subordinateCount: { $size: '$subordinates' }
      }
    },
    { $match: { subordinateCount: { $gt: 0 } } },
    { $sort: { subordinateCount: -1 } },
    { $limit: limit }
  ]);
};


const getUnstaffedProjects = async () => {
  const allProjects = await Project.find();
  const staffedProjectIds = await WorksOn.distinct('projectId');
  
  return allProjects.filter(
    project => !staffedProjectIds.some(id => id.equals(project._id))
  );
};

export {
  getEmployeeStatsByDepartment,
  getTotalHoursPerProject,
  getTotalHoursPerEmployee,
  getDepartmentSummary,
  getEmployeesWithoutSupervisor,
  getTopSupervisors,
  getUnstaffedProjects
};