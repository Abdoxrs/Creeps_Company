import e, { json, urlencoded } from 'express';
import morgan from 'morgan';

import departmentsrouter from './Routers/departments.router.js';
import dependentsrouter from './Routers/dependents.router.js';
import employeesrouter from './Routers/employees.router.js';
import projectsrouter from './Routers/projects.router.js';
import usersrouter from './Routers/users.router.js';
import adminrouter from './Routers/admin.router.js';

import globalErrorHandler from './utilities/globalErrorHandler.js';

const app = e();

app.use(morgan("dev"));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));


app.use('/departments', departmentsrouter);
app.use('/dependents', dependentsrouter);
app.use('/employees', employeesrouter);
app.use('/projects', projectsrouter);
app.use('/users', usersrouter);
app.use('/admin', adminrouter);


app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Resource not found: ${req.originalUrl}`,
    data: null,
  });
});

app.use(globalErrorHandler);

export default app;