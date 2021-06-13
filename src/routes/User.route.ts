import { Router } from 'express';
import { getUserByToken } from '../functions/Auth';
import { create, getAll, getOne, remove, update } from '../functions/User';

import User from '../models/User';
import { UserRequest } from '../services/User.service';

const routes = Router();

// pensar soobre auth

// routes.get('/', getUserByToken, async (_request, response) => {
routes.get('/', async (_request, response) => {
  const { status, error, users } = await getAll();

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(users);
});

routes.post('/', async (request, response) => {
  const {
    cpf,
    email,
    name,
    password,
    role,
    telephone,
    address,
    zipcode,
  } = request.body as UserRequest;
  const { status, error, user } = await create({
    cpf,
    email,
    name,
    password,
    role,
    telephone,
    address,
    zipcode,
  });

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(user);
});

routes.get('/:id', async (request, response) => {
  // routes.get('/:id', getUserByToken, async (request, response) => {
  const { id } = request.params;
  const { status, error, user } = await getOne(id);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(user);
});

// routes.put('/:id', getUserByToken, async (request, response) => {
routes.put('/:id', async (request, response) => {
  const { id } = request.params;
  const body = request.body as Partial<User> | User;
  const { status, error, user } = await update(id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(user);
});

// routes.delete('/:id', getUserByToken, async (request, response) => {
routes.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const { status, error } = await remove(id);

  if (status !== 204) {
    return response.status(status).json({ error });
  }

  return response.status(status).end();
});

export { routes as userRoute };
