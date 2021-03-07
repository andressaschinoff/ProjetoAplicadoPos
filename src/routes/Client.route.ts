import { Router, Request, Response, NextFunction, Errback } from 'express';
import typeorm, { getRepository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';

import Client from '../models/Client';
import CreateClientService from '../services/Client.service';
import User from '../models/User';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

async function encryptation(password: string) {
  const encrypting = await genSalt(10, (err, salt) => {
    if (err) {
      return err;
    }
    hash(password, salt, (err, hash) => {
      if (err) {
        return err;
      }
      return hash;
    });
  });
  return encrypting;
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
    const currentClient = {
      name,
      cpf,
      email,
      password,
      telephone,
    };

    await genSalt(10, (err, salt) => {
      if (err) {
        return response.status(424).json({
          message: 'Error to encrypt password, please try again later',
          err,
        });
      }
      hash(password, salt, (err, hash) => {
        if (err) {
          return response.status(424).json({
            message: 'Error to encrypt password, please try again later',
            err,
          });
        }
        currentClient.password = hash;
      });
    });

    const client = await newClient.execute(currentClient);

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

routes.patch('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, cpf, email, password, telephone } = request.body;

    const clientRepository = getRepository(Client);

    const currentClient = {
      name,
      cpf,
      email,
      password,
      telephone,
    };

    await genSalt(10, (err, salt) => {
      if (err) {
        return response.status(424).json({
          message: 'Error to encrypt password, please try again later',
          err,
        });
      }
      hash(password, salt, (err, hash) => {
        if (err) {
          return response.status(424).json({
            message: 'Error to encrypt password, please try again later',
            err,
          });
        }
        currentClient.password = hash;
      });
    });

    await clientRepository.update(id, currentClient);

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
