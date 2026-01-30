import mongoose from 'mongoose';

const SexEnum = ['Male', 'Female'];

const employeeSchema = new mongoose.Schema({
  ssn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: {
      fname: { type: String, required: true, trim: true },
      minit: { type: String, maxlength: 1, trim: true, default: null },
      lname: { type: String, required: true, trim: true },
    },
    required: true,
    _id: false,
  },
  bdate: {
    type: Date,
  },
  address: {
    type: String,
  },
  sex: {
    type: String,
    enum: SexEnum,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  deptNo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    index: true
  },
  superSsn: {
    type: String,
    ref: 'Employee',
    index: true,
    validate: {
      validator: function(value) {
        return !value || value !== this.ssn;
      },
      message: 'An employee cannot supervise themselves'
    }
  }
}, {
  timestamps: true
});


employeeSchema.virtual('fullName').get(function() {
  return `${this.name.fname} ${this.name.minit ? this.name.minit + '. ' : ''}${this.name.lname}`;
});


employeeSchema.virtual('subordinates', {
  ref: 'Employee',
  localField: 'ssn',
  foreignField: 'superSsn'
});


employeeSchema.pre('save', async function() {
  if (this.isModified('superSsn') && this.superSsn && this.deptNo) {
    const supervisor = await this.constructor.findOne({ ssn: this.superSsn });

    if (!supervisor) {
      throw new Error('Supervisor does not exist');
    }

    if (supervisor.deptNo && this.deptNo && supervisor.deptNo.toString() !== this.deptNo.toString()) {
      throw new Error('Supervisor must be in the same department');
    }
  }
});

employeeSchema.methods.hasCircularSupervision = async function() {
  const visited = new Set();
  let currentSsn = this.superSsn;
  
  while (currentSsn) {
    if (visited.has(currentSsn) || currentSsn === this.ssn) {
      return true;
    }
    
    visited.add(currentSsn);
    const supervisor = await this.constructor.findOne({ ssn: currentSsn });
    
    if (!supervisor) break;
    currentSsn = supervisor.superSsn;
  }
  
  return false;
};

export default mongoose.model('Employee', employeeSchema);