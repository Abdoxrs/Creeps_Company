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
  }
});

export default mongoose.model('Project', projectSchema);