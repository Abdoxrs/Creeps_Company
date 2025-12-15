const Department = require('../Models/Deps.model');

async function CreateDepartment(req, res) {
  try {
    const createdDep = await Department.create(req.body);
    res.status(201).json(createdDep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function GetAllDepartments(req, res) {
  try {
    const allDepartments = await Department.find();
    res.status(201).json(allDepartments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function GetDepartment(req, res) {
  try {
    const ID = req.params.id;
    const matched = await Department.findById(ID);
    res.status(200).json(matched);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function UpdateDepartment(req, res) {
  try {
    const ID = req.params.id;
    const target = await Department.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true
    });;
    res.status(200).json(target);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function DeleteAllDepartments(req, res) {
  try {
    const result = await Department.deleteMany({});
    res.status(200).json({
      message: `${result.deletedCount} departments deleted successfully.`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete departments.',
      error: error.message
    });
  }
}