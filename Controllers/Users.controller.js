import User from '../Models/users.model.js';
import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: user
  });
});


export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = asyncHandler(async (req, res) => {
  if (req.body.password || req.body.passwordConfirmation) {
    throw new ApiError('This route is not for password updates. Please use /update-password', 400);
  }

  const filteredBody = filterObj(req.body, 'email');
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.body.password || req.body.passwordConfirmation) {
    throw new ApiError('This route is not for password updates', 400);
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: user
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});