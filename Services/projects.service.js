import Project from '../Models/projects.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

const createProject = (data) => Project.create(data);

const getProjects = (queryParams) => {
  const apiFeature = new ApiFeatures(Project.find({}), queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  return apiFeature.dbQuery;
};

const getProjectById = (id) => Project.findById(id);

const updateProject = (id, updated) => {
  return Project.findByIdAndUpdate(id, updated, { new: true, runValidators: true });
};

const deleteProjectById = (id) => Project.findByIdAndDelete(id);

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProjectById
};