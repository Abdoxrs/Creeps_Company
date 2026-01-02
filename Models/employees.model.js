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
}, {
  timestamps: true  // ✅ Add timestamps for better tracking
});

// ✅ Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.name.fname} ${this.name.minit ? this.name.minit + '. ' : ''}${this.name.lname}`;
});

export default mongoose.model('Employee', employeeSchema);