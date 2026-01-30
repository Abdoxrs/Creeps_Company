import express, { json, urlencoded } from 'express';
import morgan from 'morgan';


import departmentsRouter from './Routers/departments.router.js';
import dependentsRouter from './Routers/dependents.router.js';
import employeesRouter from './Routers/employees.router.js';
import projectsRouter from './Routers/projects.router.js';
import usersRouter from './Routers/users.router.js';
import worksOnRouter from './Routers/workson.router.js';
import reportingRouter from './Routers/reporting.router.js';
import adminRouter from './Routers/admin.router.js';

import globalErrorHandler from './utilities/globalErrorHandler.js';
import ApiError from './utilities/ApiError.js';


const app = express();


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));


app.use('/departments', departmentsRouter);
app.use('/dependents', dependentsRouter);
app.use('/employees', employeesRouter);
app.use('/projects', projectsRouter);
app.use('/users', usersRouter);
app.use('/works-on', worksOnRouter);
app.use('/reports', reportingRouter);
app.use('/admin', adminRouter);


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.all('{*path}', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});app.use(globalErrorHandler);

export default app;