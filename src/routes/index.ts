import { Router, request, response } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  response.json({ message: 'Feira na mão' });
});

export default routes;
