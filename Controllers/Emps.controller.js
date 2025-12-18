import mongoose from 'mongoose';
import Employee from '../Models/Emps.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

async function createEmp(req, res) {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'SSN already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function GetAllEmps(req, res) {
  try {
    const query = Employee.find({});
    const apiBuild = new ApiFeatures(query, req.query);
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
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(matched);
  } catch (error) {
    res.status(404).json({ message: 'Employee not found' });
  }
}

async function updateEmp(req, res) {
  try {
    const ID = req.params.id;
    const allowedFields = ['ssn', 'name', 'bdate', 'address', 'sex', 'salary'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    const employee = await Employee.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'SSN already exists' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function deleteEmp(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Employee ID format' });
    }

    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ 
      data: { deleted: true },
      message: 'Employee deleted successfully', 
      employee 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  createEmp,
  GetAllEmps,
  GetEmp,
  updateEmp,
  deleteEmp 
};