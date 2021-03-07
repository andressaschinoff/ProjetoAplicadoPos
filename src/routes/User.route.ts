import { genSalt, hash } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';
import CreateUserService from '../services/User.service';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.get('/', async (_request, response) => {
  try {
    const userRepository = getRepository(User);

    const users = await userRepository.find();

    return response.json(users);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.post('/', async (request, response) => {
  try {
    const { name, cpf, email, password, telephone, fair } = request.body;

    const newUser = new CreateUserService();

    const currentUser = {
      name,
      cpf,
      email,
      password,
      telephone,
      fair,
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
        currentUser.password = hash;
      });
    });

    const user = await newUser.execute(currentUser);

    return response.json(user);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const userRepository = getRepository(User);
    const user = await userRepository.findByIds([id]);

    return response.json(user);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, cpf, email, password, telephone, fair } = request.body;

    const userRepository = getRepository(User);

    await userRepository.update(id, {
      name,
      cpf,
      email,
      password,
      telephone,
      fair,
    });

    const updateUser = await userRepository.findByIds([id]);

    return response.json(updateUser);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const userRepository = getRepository(User);
    await userRepository.delete(id);

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as userRoute };
