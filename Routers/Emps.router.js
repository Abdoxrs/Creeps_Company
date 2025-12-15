const express = require('express');
const { 
  createEmp, 
  GetAllEmps, 
  GetEmp, 
  updateEmp, 
  deleteEmp, 
} = require('../Controllers/Emps.controller');

const router = express.Router();

router.post('/', createEmp);

router.get('/', GetAllEmps);
router.get('/:id', GetEmp);

router.patch('/:id', updateEmp);

router.delete('/:id', deleteEmp);

module.exports = router;