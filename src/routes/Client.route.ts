import { Router, Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import Client from '../models/Client';
import CreateClientService from '../services/Client.service';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.get('/', async (_request, response) => {
  try {
    const clientRepository = getRepository(Client);

    const clients = await clientRepository.find();

    return response.json(clients);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.post('/', async (request, response) => {
  try {
    const { name, cpf, email, password, telephone } = request.body;

    const newClient = new CreateClientService();

    const client = await newClient.execute({
      name,
      cpf,
      email,
      password,
      telephone,
    });

    return response.json(client);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const clientRepository = getRepository(Client);
    const client = await clientRepository.findByIds([id]);

    return response.json(client);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, cpf, email, password, telephone } = request.body;

    const clientRepository = getRepository(Client);

    await clientRepository.update(id, {
      name,
      cpf,
      email,
      password,
      telephone,
    });

    const updateClient = await clientRepository.findByIds([id]);

    return response.json(updateClient);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const clientRepository = getRepository(Client);
    await clientRepository.delete(id);

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as clientRoute };
