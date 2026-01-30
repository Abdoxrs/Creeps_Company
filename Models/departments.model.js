import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  locations: {
    type: [String],
    default: []
  },
  mgrSsn: {
    type: String,
    ref: 'Employee',
    index: true
  },
  mgrStartDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || !this.mgrSsn || value <= new Date();
      },
      message: 'Manager start date cannot be in the future'
    }
  }
}, {
  timestamps: true
});


DepartmentSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'deptNo'
});


DepartmentSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'controllingDept'
});


DepartmentSchema.pre('save', async function() {
  if (this.isModified('mgrSsn') && this.mgrSsn) {
    const Employee = mongoose.model('Employee');
    const manager = await Employee.findOne({ ssn: this.mgrSsn });
    if (!manager) {
      throw new Error('Manager must be a valid employee');
    }

    if (manager.deptNo && this._id && manager.deptNo.toString() !== this._id.toString()) {
      throw new Error('Manager must be an employee in this department');
    }
  }
});

export default mongoose.model("Department", DepartmentSchema);