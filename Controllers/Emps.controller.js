const Employee = require('../Models/Emps.model');
const ApiFeatures = require('../utilities/ApiFeatures')

async function createEmp(req, res) {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function GetAllEmps(req, res) {
  try {
    const query = Employee.find({});
    const apiBuild = new ApiFeatures(query, req.query)
    apiBuild.sort().paginate().projection();
    const employees = await apiBuild.dbQuery;
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetEmp(req, res) {
  try {
    const ID = req.params.id;
    const matched = await Employee.findById(ID);
    if (!matched) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(matched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateEmp(req, res) {
  try {
    const ID = req.params.id;
    const employee = await Employee.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteEmp(req, res) {
  try {
    const ID = req.params.id;
    const employee = await Employee.findByIdAndDelete(ID);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createEmp, GetAllEmps, GetEmp, updateEmp, deleteEmp };