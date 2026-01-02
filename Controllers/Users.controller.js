import {
  SignupUser,
  LoginUser,
  getUserById,
  updateUserPassword,
  updateUserProfile
} from '../Services/users.service.js';
import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';

const CreateUser = asyncHandler(async (req, res) => {
  const NewUser = await SignupUser(req.body);
  NewUser.password = undefined;
  NewUser.passwordConfirmation = undefined;
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: NewUser
  })
});

const Login = asyncHandler(async (req, res) => {
  const token = await LoginUser(req.body);
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: { token }
  });
});

const FindUser = asyncHandler(async (req, res) => {
  const TheOne = await getUserById(req.params.id)
  res.status(200).json({
    status: "success",
    message: "User found",
    data: TheOne
  })
});


const UpdateUserProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserProfile(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: updatedUser
  });
});


const ChangePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;
  
  if (!currentPassword || !newPassword || !newPasswordConfirmation) {
    throw new ApiError('All password fields are required', 400);
  }
  
  const result = await updateUserPassword(
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