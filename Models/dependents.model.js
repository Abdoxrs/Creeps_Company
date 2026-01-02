import mongoose from 'mongoose';

const DependentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  birthDate: {
    type: Date,
  },
  relationship: {
    type: String,
    trim: true,
  },
});

DependentSchema.index({ employeeId: 1, name: 1 }, { unique: true });
export default mongoose.model('Dependent', DependentSchema);