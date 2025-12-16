import app from "../server.js";
import morgan from 'morgan';
import {json , urlencoded} from 'express';

function middleWare(){
  app.use(morgan("dev"));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
}

export default middleWare;