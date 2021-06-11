import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { getUserByToken, isSeller } from '../functions/Auth';
import { create, getAll, getOne, remove, update } from '../functions/Fair';
import { responseLog } from '../functions/Logs';
import Fair from '../models/Fair';
import User from '../models/User';

import FairRepository from '../repositories/Fair.repository';
import {
  CreateFairService,
  FairRequest,
  ScoreFairService,
} from '../services/Fair.service';

const routes = Router();

routes.get('/', async (_request, response) => {
  const { status, error, fairs } = await getAll();

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(fairs);
});

routes.post('/', getUserByToken, isSeller, async (request, response) => {
  const body = request.body as FairRequest;
  const user = request.user as User;
  const { status, error, fair } = await create(user.id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(fair);
});

routes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { status, error, fair } = await getOne(id);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(fair);
});

routes.get('/filter/opening', async (_request, response) => {
  try {
    const fairRepository = getCustomRepository(FairRepository);
    const fairs = await fairRepository.findByOpening();

    return fairs;
  } catch (err) {
    responseLog(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/filter?', async (request, response) => {
  try {
    const { type, name, product } = request.query;

    const filterArray: string = type
      ? String(type)
      : product
      ? String(product)
      : '';
    const filter: string = name ? String(name) : '';

    const key = type ? 'types' : 'products';

    const fairRepository = getCustomRepository(FairRepository);

    const fairs =
      filterArray !== ''
        ? await fairRepository.findByArray(key, filterArray)
        : await fairRepository.findByName(filter);

    return response.json(fairs);
  } catch (err) {
    responseLog(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', getUserByToken, isSeller, async (request, response) => {
  const { id } = request.params;
  const body = request.body as Partial<Fair> | Fair;
  const { status, error, fair } = await update(id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(fair);
});

routes.put('/:id/score', async (request, response) => {
  try {
    const { id } = request.params;
    const { score } = request.body;

    const scoreService = new ScoreFairService();
    const updateFair = await scoreService.execute(id, { score });

    return response.json(updateFair);
  } catch (err) {
    responseLog(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', getUserByToken, isSeller, async (request, response) => {
  const { id } = request.params;

  const { status, error } = await remove(id);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).end();
});

export { routes as fairRoute };
