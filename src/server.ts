import 'reflect-metadata';
import express from 'express';
import { productRoute } from './routes/Product.route';
import { fairRoute } from './routes/Fair.route';
import { typeRoute } from './routes/Type.route';
import { userRoute } from './routes/User.route';
import { trollerRoute } from './routes/Troller.route';
import { clientRoute } from './routes/Client.route';
import { loginRoute } from './routes/Login.route';

import './database';

const app = express();

app.use(express.json());

app.use('/login', loginRoute);
app.use('/product', productRoute);
app.use('/fair', fairRoute);
app.use('/type', typeRoute);
app.use('/user', userRoute);
app.use('/client', clientRoute);
app.use('/troller', trollerRoute);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
