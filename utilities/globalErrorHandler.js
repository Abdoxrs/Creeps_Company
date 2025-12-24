export default (error, req, res, next) => {
  if (error.isOperational) {
    res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};