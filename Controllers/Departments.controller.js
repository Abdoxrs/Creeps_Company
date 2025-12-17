import Dependent from '../Models/Dependent.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';

async function CreateDependent(req, res) {
  try {
    const dependent = await Dependent.create(req.body);
    res.status(201).json(dependent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Dependent with this name already exists for this employee' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function GetAllDependents(req, res) {
  try {
    const query = Dependent.find({}).populate('employeeId', 'ssn name');
    const apiBuild = new ApiFeatures(query, req.query);
    apiBuild.sort().paginate().projection();
    const dependents = await apiBuild.dbQuery;
    res.status(200).json(dependents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetDependent(req, res) {
  try {
    const ID = req.params.id;
    const dependent = await Dependent.findById(ID).populate('employeeId', 'ssn name');
    
    if (!dependent) {
      return res.status(404).json({ message: 'Dependent not found' });
    }
    
    res.status(200).json(dependent);
  } catch (error) {
    res.status(404).json({ message: 'Dependent not found' });
  }
}

async function UpdateDependent(req, res) {
  try {
    const ID = req.params.id;
    const allowedFields = ['employeeId', 'name', 'sex', 'birthDate', 'relationship'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    const dependent = await Dependent.findByIdAndUpdate(ID, req.body, { 
      new: true, 
      runValidators: true 
    }).populate('employeeId', 'ssn name');
    
    if (!dependent) {
      return res.status(404).json({ message: 'Dependent not found' });
    }
    
    res.status(200).json(dependent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Dependent with this name already exists for this employee' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function DeleteDependent(req, res) {
  try {
    const ID = req.params.id;
    const dependent = await Dependent.findByIdAndDelete(ID);
    
    if (!dependent) {
      return res.status(404).json({ message: 'Dependent not found' });
    }
    
    res.status(200).json({ 
      data: { deleted: true },
      message: 'Dependent deleted successfully', 
      dependent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { 
  CreateDependent, 
  GetAllDependents, 
  GetDependent, 
  UpdateDependent, 
  DeleteDependent 
};