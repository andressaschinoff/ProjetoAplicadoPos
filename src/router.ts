import express from 'express';
import cors from 'cors';
import { productRoute } from './routes/Product.route';
import { fairRoute } from './routes/Fair.route';
import { typeRoute } from './routes/Type.route';
import { userRoute } from './routes/User.route';
import { trollerRoute } from './routes/Troller.route';
import { loginRoute } from './routes/Login.route';

const router = express();

router.use(cors());

router.use('/login', loginRoute);
router.use('/product', productRoute);
router.use('/fair', fairRoute);
router.use('/type', typeRoute);
router.use('/user', userRoute);
router.use('/troller', trollerRoute);

export default router;
