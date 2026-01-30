import mongoose from 'mongoose';

const WorksOnSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  hours: {
    type: Number,
    required: true,
    min: [0, 'Hours cannot be negative'],
    max: [168, 'Hours per week cannot exceed 168']
  }
}, {
  timestamps: true
});


WorksOnSchema.index({ employeeId: 1, projectId: 1 }, { unique: true });


WorksOnSchema.pre('save', async function() {
  const Employee = mongoose.model('Employee');
  const employee = await Employee.findById(this.employeeId);

  if (!employee) {
    throw new Error('Employee does not exist');
  }

  const Project = mongoose.model('Project');
  const project = await Project.findById(this.projectId);

  if (!project) {
    throw new Error('Project does not exist');
  }
});

export default mongoose.model('WorksOn', WorksOnSchema);