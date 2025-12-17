import Department from '../Models/Deps.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

async function CreateDepartment(req, res) {
  try {
    const createdDep = await Department.create(req.body);
    res.status(201).json(createdDep);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Department number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function GetAllDepartments(req, res) {
  try {
    let query = Department.find({});
    const queryBuld = new ApiFeatures(query, req.pody)
    queryBuld.sort().paginate().projection();
    const allDepartments = await queryBuld.dbQuery;
    res.status(200).json(allDepartments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetDepartment(req, res) {
  try {
    const ID = req.params.id;
    const matched = await Department.findById(ID);
    if (!matched) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(matched);
  } catch (error) {
    res.status(404).json({ message: 'Department not found' });
  }
}

async function UpdateDepartment(req, res) {
  try {
    const ID = req.params.id;
    const allowedFields = ['number', 'name', 'locations'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    const target = await Department.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true
    });
    
    if (!target) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.status(200).json(target);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Department number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function DeleteDepartment(req, res) {
  try {
    const ID = req.params.id;
    const deletedOne = await Department.findByIdAndDelete(ID);
    
    if (!deletedOne) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.status(200).json({ 
      data: { deleted: true },
      message: 'Department deleted successfully', 
      department: deletedOne 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, 
  UpdateDepartment, 
  DeleteAllDepartments, 
  DeleteDepartment
};