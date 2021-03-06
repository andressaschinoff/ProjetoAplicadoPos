import { Router, Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Troller from '../models/Troller';

import CreateTrollerService from '../services/Troller.service';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.post('/', async (request, response) => {
  try {
    const { products, client } = request.body;

    const newTroller = new CreateTrollerService();

    const troller = await newTroller.execute({
      products,
      client,
    });

    return response.json(troller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);
    const troller = await trollerRepository.findByIds([id]);

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { products } = request.body;

    const trollerRepository = getRepository(Troller);

    await trollerRepository.update(id, {
      products,
    });

    const updateTroller = await trollerRepository.findByIds([id]);

    return response.json(updateTroller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);
    await trollerRepository.delete(id);

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as trollerRoute };
