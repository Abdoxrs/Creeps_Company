import User from '../Models/users.model.js'
import ApiFeatures from '../utilities/ApiFeatures.js'
import ApiError from '../utilities/ApiError.js'
import * as jwt from 'jsonwebtoken'
import * as bcrybt from 'bcrypt'

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
  const isTheOne = await bcrybt.compare(password,hashedPassword);
  if(!isTheOne){
    throw new ApiError("Wrong email or password, please try again !!", 400);
  }
  return jwt.sign(
    { id: userDoc._id, role: userDoc.role },
    "this is my secret"
  );
}

const getUserById = (id) => User.findById(id);

export {
  SignupUser,
  LoginUser,
  getUserById,
}