import { Router } from 'express';
import { upload, imageUpload } from '../functions/Image';

const routes = Router();

routes.post('/', upload.single('image'), imageUpload);

export { routes as imageRoute };
