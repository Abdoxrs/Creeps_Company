import app from './server.js';

import middleWare from './middlewares/middleware.js';
import ErrorHandler from './middlewares/ErrorHandler.js';

import Empsrouter from './Routers/Emps.router.js';
import Depsrouter from './Routers/Deps.router.js';
import Projsrouter from './Routers/Projs.router.js';
import Dependentsrouter from './Routers/Dependents.router.js';


middleWare();
app.use('/employees', Empsrouter);
app.use('/departments', Depsrouter);
app.use('/projects', Projsrouter);
app.use('/dependents', Dependentsrouter);
ErrorHandler()