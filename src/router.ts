import express from 'express';
import cors from 'cors';
import { productRoute } from './routes/Product.route';
import { fairRoute } from './routes/Fair.route';
import { typeRoute } from './routes/Type.route';
import { userRoute } from './routes/User.route';
import { trollerRoute } from './routes/Troller.route';
import { imageRoute } from './routes/Image.route';
import { loginRoute } from './routes/Login.route';
import { logRequest } from './functions/Logs';
import { isSeller, getUserByToken } from './functions/Auth';

const router = express();

router.use(cors());

router.use(logRequest);
router.use('/assets', express.static(__dirname + '/assets'));
router.use('/image', getUserByToken, isSeller, imageRoute);
router.use('/login', loginRoute);
router.use('/product', productRoute);
router.use('/fair', fairRoute);
router.use('/type', typeRoute);
router.use('/user', userRoute);
router.use('/troller', trollerRoute);

export default router;
