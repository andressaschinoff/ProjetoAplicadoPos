import 'reflect-metadata';
import express from 'express';
import { productRoute } from './routes/ProductRoute';

import './database';

const app = express();

app.use(express.json());

app.use('/product', productRoute);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
