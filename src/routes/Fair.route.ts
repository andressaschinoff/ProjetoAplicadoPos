import { Router, Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import FairRepository from '../repositories/Fair.repository';
import { CreateFairService, ScoreFairService } from '../services/Fair.service';

const routes = Router();

// function logRequest(request: Request, _response: Response, next: NextFunction) {
//   const { method, originalUrl } = request;
//   console.info(method + ': ' + originalUrl);
//   return next();
// }

// routes.use(logRequest);

routes.get('/', async (_request, response) => {
  try {
    const fairRepository = getCustomRepository(FairRepository);

    const fairs = await fairRepository.find();

    return response.json(fairs);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.post('/', async (request, response) => {
  try {
    const {
      name,
      zipcode,
      address,
      opening,
      closing,
      weekdays,
      deliveryPrice,
      types,
    } = request.body;

    // pegar user e  vincular a feira registrada

    const newFair = new CreateFairService();

    const fair = await newFair.execute({
      name,
      zipcode,
      address,
      opening,
      closing,
      weekdays,
      deliveryPrice,
      types,
    });

    return response.json(fair);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const fairRepository = getCustomRepository(FairRepository);
    const fair = await fairRepository.findOne({ id });

    return response.json(fair);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/filter/opening', async (_request, response) => {
  try {
    const fairRepository = getCustomRepository(FairRepository);
    const fairs = await fairRepository.findByOpening();

    return fairs;
  } catch (err) {
    console.error(err);
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
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const {
      name,
      zipcode,
      address,
      opening,
      closing,
      weekdays,
      deliveryPrice,
      types,
    } = request.body;

    const fairRepository = getCustomRepository(FairRepository);

    await fairRepository.update(id, {
      name,
      zipcode,
      address,
      opening,
      closing,
      weekdays,
      deliveryPrice,
      types,
    });

    const updateFair = await fairRepository.findByIds([id]);

    return response.json(updateFair);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id/score', async (request, response) => {
  try {
    const { id } = request.params;
    const { score } = request.body;

    const scoreService = new ScoreFairService();
    const updateFair = await scoreService.execute(id, { score });

    return response.json(updateFair);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const fairRepository = getCustomRepository(FairRepository);
    await fairRepository.delete(id);

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as fairRoute };
