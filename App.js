import app from './server.js';
import middleWare from './middlewares/middleware.js';
import Empsrouter from './Routers/Emps.router.js';
import Depsrouter from './Routers/Deps.router.js';
import Projsrouter from './Routers/Projs.router.js';
import Dependentsrouter from './Routers/Dependents.router.js';


middleWare();

// Routes
app.use('/employees', Empsrouter);
app.use('/departments', Depsrouter);
app.use('/projects', Projsrouter);
app.use('/dependents', Dependentsrouter);


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
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: Object.values(err.errors).map(e => e.message)
      }
    });
  }
  
  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid ID format'
      }
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Duplicate key error',
        details: err.message
      }
    });
  }
  
  // Default error
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});