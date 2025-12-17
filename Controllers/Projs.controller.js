import Project from '../Models/Project.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

async function CreateProject(req, res) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Project number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function GetAllProjects(req, res) {
  try {
    const query = Project.find({});
    const apiBuild = new ApiFeatures(query, req.query);
    apiBuild.sort().paginate().projection();
    const projects = await apiBuild.dbQuery;
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetProject(req, res) {
  try {
    const ID = req.params.id;
    const project = await Project.findById(ID);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: 'Project not found' });
  }
}

async function UpdateProject(req, res) {
  try {
    const ID = req.params.id;
    const allowedFields = ['name', 'location'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    const project = await Project.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Project number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function DeleteProject(req, res) {
  try {
    const ID = req.params.id;
    const project = await Project.findByIdAndDelete(ID);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json({ 
      data: { deleted: true },
      message: 'Project deleted successfully', 
      project 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { 
  CreateProject, 
  GetAllProjects, 
  GetProject, 
  UpdateProject, 
  DeleteProject 
};