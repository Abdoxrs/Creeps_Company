import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  number: {
    type : Number,
    unique : true,
    required : true
  },
  name: {
    type : String,
    required : true
  },
  locations: {
    type : [String],
    default : []
  }
})

exports.model = mongoose.model("Department", DepartmentSchema);
/*
----------Project---------------
number (number, unique, required)
name (string, required)
location (string)
*/