import e, { json, urlencoded } from 'express';
import morgan from 'morgan';

import Empsrouter from './Routers/Emps.router.js';
import Depsrouter from './Routers/Deps.router.js';
import Projsrouter from './Routers/Projs.router.js';
import Dependentsrouter from './Routers/Dependents.router.js';
// import Userrouter from './Routers/Users.router.js'

import globalErrorHandler from './utilities/globalErrorHandler.js'
// ApiError

const app = e();

app.use(morgan("dev"));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

// app.use('/users', usersrouter)
app.use('/employees', Empsrouter);
app.use('/departments', Depsrouter);
app.use('/projects', Projsrouter);
app.use('/dependents', Dependentsrouter);

app.all("{*path}", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `resource not found`,
    data: null,
  });
});
app.use(globalErrorHandler);

export default app;