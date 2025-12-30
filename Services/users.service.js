import User from '../Models/users.model.js'
import ApiError from '../utilities/ApiError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SignupUser = (data) => User.create(data);

const LoginUser = async (data) => {
  const userDoc = await User.findOne({ email: data.email }).select(
    "password email role createdAt updatedAt"
  );
  
  if (!userDoc) {
    throw new ApiError("Wrong email or password, please try again!", 400)
  }

  // ✅ Use the instance method
  const isPasswordCorrect = await userDoc.comparePassword(data.password);
  
  if (!isPasswordCorrect) {
    throw new ApiError("Wrong email or password, please try again!", 400);
  }
  
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id: userDoc._id, role: userDoc.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

const getUserById = (id) => User.findById(id);

// ✅ New: Safe password update
const updateUserPassword = async (userId, currentPassword, newPassword, newPasswordConfirmation) => {
  // Get user with password
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError('Current password is incorrect', 401);
  }
  
  // Update password using the instance method
  await user.changePassword(newPassword, newPasswordConfirmation);
  
  return { message: 'Password updated successfully' };
};

// ✅ New: Safe user profile update (without password)
const updateUserProfile = async (userId, updates) => {
  // Remove password fields if accidentally included
  delete updates.password;
  delete updates.passwordConfirmation;
  delete updates.role;  // Prevent role escalation
  
  const user = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  return user;
};

export {
  SignupUser,
  LoginUser,
  getUserById,
  updateUserPassword,
  updateUserProfile
}