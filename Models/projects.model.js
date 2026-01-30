import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  controllingDept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    index: true
  }
}, {
  timestamps: true
});


projectSchema.virtual('workers', {
  ref: 'WorksOn',
  localField: '_id',
  foreignField: 'projectId'
});

export default mongoose.model('Project', projectSchema);