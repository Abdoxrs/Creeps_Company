import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../Models/users.model.js';
import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';
import sendEmail from '../utilities/email.js';


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  
  user.password = undefined;
  user.passwordConfirmation = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    message,
    data: {
      user,
      token
    }
  });
};


export const signup = asyncHandler(async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    role: req.body.role
  });
  
  createSendToken(newUser, 201, res, 'User created successfully');
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError('Please provide email and password', 400);
  }
  

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Incorrect email or password', 401);
  }
  
  createSendToken(user, 200, res, 'Logged in successfully');
});


export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    throw new ApiError('No user found with that email address', 404);
  }
  
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/users/reset-password/${resetToken}`;
    
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirmation to: ${resetURL}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });
    
    res.status(200).json({
      status: 'success',
      message: `Your password reset token (valid for 10 minutes) Token sent to email ${user.email}
      for testing this is email here ${message}`
    });
  } catch (err) {
    console.error('forgotPassword: error sending email:', err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new ApiError('There was an error sending the email. Try again later.', 500);
  }
});


export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select('+passwordResetToken +passwordResetExpires');
  
  if (!user) {
    throw new ApiError('Token is invalid or has expired', 400);
  }
  
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  createSendToken(user, 200, res, 'Password reset successful');
});


export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');
  
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError('Your current password is incorrect', 401);
  }
  
  user.password = req.body.newPassword;
  user.passwordConfirmation = req.body.newPasswordConfirmation;
  await user.save();
  
  createSendToken(user, 200, res, 'Password updated successfully');
});