const mongoose = require('mongoose');
const SexEnum = ['M', 'F'];

const employeeSchema = new mongoose.Schema({
  ssn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  },
});

module.exports = mongoose.model('Employee', employeeSchema);