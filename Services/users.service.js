import User from '../Models/users.model.js'
import ApiError from '../utilities/ApiError.js'
import jwt from 'jsonwebtoken'


const SignupUser = (data) => User.create(data);

const LoginUser = async (data) => {
  const userDoc = await User.findOne({ email: data.email }).select(
    "password email role createdAt updatedAt"
  );
  
  if (!userDoc) {
    throw new ApiError("Wrong email or password, please try again!", 400)
  }

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


const updateUserPassword = async (userId, currentPassword, newPassword, newPasswordConfirmation) => {
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect){
    throw new ApiError('Current password is incorrect renter it!!', 401);
  }
  
  await user.changePassword(newPassword, newPasswordConfirmation);
  
  return { message: 'Password updated successfully' };
};

const updateUserProfile = async (userId, updates) => {
  delete updates.password;
  delete updates.passwordConfirmation;
  delete updates.role;
  
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