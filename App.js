import e, { json, urlencoded } from 'express';
import morgan from 'morgan';

import employeesrouter from './Routers/employees.router.js';
import departmentsrouter from './Routers/departments.router.js';
import projectsrouter from './Routers/projects.router.js';
import dependentsrouter from './Routers/dependents.router.js';
import usersrouter from './Routers/users.router.js';

import globalErrorHandler from './utilities/globalErrorHandler.js'

const app = e();

app.use(morgan("dev"));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

app.use('/users', usersrouter)
app.use('/employees', employeesrouter);
app.use('/departments', departmentsrouter);
app.use('/projects', projectsrouter);
app.use('/dependents', dependentsrouter);

app.all("{*path}", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `resource not found`,
    data: null,
  });
});
app.use(globalErrorHandler);

export default app;