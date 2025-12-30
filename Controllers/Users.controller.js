import * as UserService from '../Services/users.service.js';
import asyncHandler from '../utilities/asyncHandler.js';

const CreateUser = asyncHandler(async (req, res, next) => {
  const NewUser = await UserService.SignupUser(req.body);
  NewUser.password = undefined;
  NewUser.passwordConfirmation = undefined;
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: NewUser
  })
});

const Login = asyncHandler(async (req, res, next) => {
  const token = await UserService.LoginUser(req.body);
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: { token }
  });
});

const FindUser = asyncHandler(async (req, res, next) => {
  const TheOne = await UserService.getUserById(req.params.id)
  res.status(200).json({
    status: "success",
    message: "User found",
    data: TheOne
  })
});

// ✅ New: Update user profile (email, etc.)
const UpdateUserProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserService.updateUserProfile(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: updatedUser
  });
});

// ✅ New: Change password
const ChangePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;
  
  if (!currentPassword || !newPassword || !newPasswordConfirmation) {
    throw new ApiError('All password fields are required', 400);
  }
  
  const result = await UserService.updateUserPassword(
    req.params.id,
    currentPassword,
    newPassword,
    newPasswordConfirmation
  );
  
  res.status(200).json({
    status: "success",
    message: result.message
  });
});

export { 
  CreateUser, 
  Login, 
  FindUser, 
  UpdateUserProfile, 
  ChangePassword 
};