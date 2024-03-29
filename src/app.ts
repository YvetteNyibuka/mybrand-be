import express, { Express, Request, Response } from 'express';
import apiRouter from './routes/index';
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import docs from "./documentedUI";
require('dotenv').config();


const app: Express = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const corsOpts = {
  origin: '*',
  
  methods: [
  'GET',
  'POST',
  'DELETE',
  'PATCH',
  'PUT'
  ],
  
  allowedHeaders: [
  'Content-Type',
  'Authorization',
  ],
  };
app.use(cors(corsOpts));
app.use(express.json());

app.use('/api/v1', apiRouter);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs));
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to my blogs API' });
});

export default app;
