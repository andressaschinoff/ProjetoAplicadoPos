import { Router, Request, Response, NextFunction } from 'express';

import { Type } from '../enum/Type';

const routes = Router();

// function logRequest(request: Request, _response: Response, next: NextFunction) {
//   const { method, originalUrl } = request;
//   console.info(method + ': ' + originalUrl);
//   return next();
// }

// routes.use(logRequest);

routes.get('/', async (_request, response) => {
  try {
    const types = Object.values(Type);

    return response.json(types);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as typeRoute };
