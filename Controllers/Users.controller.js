const { ApiError } = require("../Utills/ApiError");
const userService = require("../Services/users.service");

// exports.createUser = async (req, res, next) => {
//   const employee = await userService.createUser(req.body);
//   employee.password = undefined;
//   res.status(201).json({
//     status: "success",
//     message: "employee created successfully",
//     data: employee,
//   });
// };

// exports.loginUser = async (req, res, next) => {
//   const token = await userService.loginUser(req.body);
//   res.status(200).json({
//     status: "success",
//     message: "User Logged in successfully",
//     data: token,
//   });
// };

// exports.getUserById = async (req, res) => {
//   console.log("HEEEELOOO");
//   const user = await userService.getUserById(req.params.id);
//   res.status(200).json({
//     status: "success",
//     message: "user data retireived successfully",
//     data: user,
//   });
// };

// // exports.getAllEmployees = async (req, res, next) => {
// //   const employees = await employeeService.getEmployees(req.query);
// //   res.status(200).json({
// //     status: "success",
// //     message: "employees retrieved successfully",
// //     data: employees,
// //   });
// // };

// // exports.getEmployee = async (req, res, next) => {
// //   try {
// //     const employee = await employeeService.getEmployeeById(req.params.id);
// //     if (!employee) {
// //       throw new ApiError("Employee not found", 404);
// //     }
// //     res.status(200).json({
// //       status: "success",
// //       message: "employee data retrieved successfully",
// //       data: employee,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // exports.updateEmployee = async (req, res, next) => {
// //   try {
// //     const employee = await employeeService.updateEmployeeById(
// //       req.params.id,
// //       req.body
// //     );
// //     if (!employee) {
// //       throw new ApiError("Employee not found", 404);
// //     }
// //     res.status(200).json({
// //       status: "success",
// //       message: "employee updated successfully",
// //       data: employee,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // exports.deleteAllEmployees = async (req, res, next) => {
// //   const result = await employeeService.deleteAllEmployees();
// //   res.status(200).json({
// //     status: "success",
// //     message: "employees deleted successfully",
// //     data: { deletedCount: result.deletedCount },
// //   });
// // };

// // exports.deleteEmployee = async (req, res, next) => {
// //   const employee = await employeeService.deleteEmployeeById(req.params.id);
// //   if (!employee) {
// //     throw new ApiError("Employee not found", 404);
// //   }
// //   res.status(200).json({
// //     status: "success",
// //     message: "employee deleted successfully",
// //   });
// // };
