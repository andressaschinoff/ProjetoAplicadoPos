import { Router } from 'express';

import { Type } from '../enum/Type';
import { responseLog } from '../functions/Logs';

const routes = Router();

routes.get('/', async (_request, response) => {
  try {
    const types = Object.values(Type);

    responseLog(undefined, types);
    return response.json(types);
  } catch (err) {
    responseLog(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as typeRoute };
