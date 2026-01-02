import { ApiError } from "./ApiError";

export function permittedTo(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    next(new ApiError("you are not permitted to perform such action", 403));
  };
}