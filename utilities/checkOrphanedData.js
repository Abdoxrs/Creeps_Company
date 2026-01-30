import mongoose from 'mongoose';

export const checkOrphanedReferences = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    if (data && res.statusCode < 400) {
      try {
        checkTopLevelReferences(data);
      } catch (err) {
        console.warn('⚠️  Error checking orphaned references:', err.message);
      }
    }
    
    return originalJson(data);
  };
  
  next();
};


function checkTopLevelReferences(data) {
  if (!data || typeof data !== 'object') return;
  
  if (Array.isArray(data)) {
    data.forEach(item => checkTopLevelReferences(item));
    return;
  }
  
  for (const key in data) {
    if (key.startsWith('_') || typeof data[key] === 'function') continue;
    
    if (key.endsWith('Id') && data[key] === null) {
      console.warn(`⚠️  Warning: Orphaned reference detected in field '${key}'`);
    }
  }
}

export const cleanOrphanedDependents = async () => {
  const Dependent = mongoose.model('Dependent');
  const Employee = mongoose.model('Employee');
  
  const dependents = await Dependent.find({});
  
  const orphaned = [];
  
  for (const dependent of dependents) {
    const employee = await Employee.findById(dependent.employeeId);
    if (!employee) {
      orphaned.push(dependent);
    }
  }
  
  if (orphaned.length > 0) {
    console.log(`Found ${orphaned.length} orphaned dependents`);
  }
  
  return orphaned;
};