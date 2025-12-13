const Department = require('../Models/Deps.model');

async function CreateDepartment(req, res) {
  try {
    const createdDep = await Department.create(req.body);
    res.status(201).json(createdDep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}