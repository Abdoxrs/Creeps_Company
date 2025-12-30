import User from '../Models/users.model.js'
import ApiError from '../utilities/ApiError.js'
import jwt from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import dotenv from 'dotenv';

dotenv.config()
const SignupUser = (data) => User.create(data);

const LoginUser = async (data) => {
  const userDoc = await User.findOne({ email: data.email }).select(
    "password email role createdAt updatedAt"
  );
  if(!userDoc){
    throw new ApiError("Wrong email or password, please try again !!", 400)
  }

  const hashedPassword = userDoc.password;
  const password = data.password;
  const isTheOne = await compare(password,hashedPassword);
  if(!isTheOne){
    throw new ApiError("Wrong email or password, please try again !!", 400);
  }
  return jwt.sign(
    { id: userDoc._id, role: userDoc.role },
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '7D'}
  );
}

const getUserById = (id) => User.findById(id);

export {
  SignupUser,
  LoginUser,
  getUserById,
}