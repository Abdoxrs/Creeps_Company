import app from "../server.js";

function ErrorHandler() {
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  });


  app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
          details: Object.values(err.errors).map(e => e.message)
        }
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid ID format'
        }
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Duplicate key error',
          details: err.message
        }
      });
    }

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  });
}
export default ErrorHandler;