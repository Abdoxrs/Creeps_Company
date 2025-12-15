const express = require('express');
const {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, //id
  UpdateDepartment, //id
  DeleteAllDepartments, 
  DeleteDepartment//id
} = require('../Controllers/Deps.controller');

const router = express();

router.post('/',CreateDepartment);

router.get('/',GetAllDepartments);
router.get('/:id',GetDepartment);

router.patch('/:id',UpdateDepartment);

router.delete('/',DeleteAllDepartments);
router.delete('/:id',DeleteDepartment)

module.exports = router;