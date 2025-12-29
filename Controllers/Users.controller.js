import * as UserService from '../Services/users.service.js';

const CreateUer = async (req, res, next) => {
  const NewUser = await UserService.SignupUser(req.body);
  NewUser.password = undefined;
  NewUser.passwordConfirmantion = undefined;
  res.status(201).json({
    status: "seccess",
    Message: "user created successfully",
    data: NewUser
  })
}

const Login = async (req, res, next) => {
  const token = await userService.loginUser(req.body);
  res.status(200).json({
    status: "success",
    message: "User Logged in successfully",
    data: token,
  });
}

const FindUser = async (req, res, next) => {
  const TheOne = await UserService.getUserById(req.params.id)
  res.status(200).json({
    status: "Success",
    message: "User Found!!",
    data: TheOne
  })
}


export {CreateUer, Login, FindUser};