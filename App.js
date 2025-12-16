import app from './server.js';
import middleWare from './middlewares/middleware.js';
import Empsrouter from './Routers/Emps.router.js';
import Depsrouter from './Routers/Deps.router.js';

middleWare();
app.use('/employees', Empsrouter)
app.use('/departments', Depsrouter)