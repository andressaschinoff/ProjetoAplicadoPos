import { Router } from 'express';
import { getRepository } from 'typeorm';
import {
  getActive,
  create,
  getAllByUser,
  getOne,
  update,
  checkout,
  replaceOrders,
} from '../functions/Troller';
import Troller from '../models/Troller';

const routes = Router();

routes.post('/', async (req, res) => {
  const { user, ...body } = req.body as Troller;
  const { status, error, troller } = await create({ user, ...body });
  if (status !== 200) {
    return res.status(status).json({ error });
  }

  return res.status(status).json(troller);
});

routes.get('/active', async (req, res) => {
  const id = req.query.id as string;
  const { status, error, troller } = await getActive(id);

  if (status !== 200) {
    return res.status(status).json({ error });
  }

  return res.status(status).json(troller);
});

routes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { status, error, troller } = await getOne(id);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(troller);
});

routes.get('/all/:userId', async (request, response) => {
  const { userId } = request.params;
  const { status, error, trollers } = await getAllByUser(userId);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json({ ...trollers });
});

routes.put('/:id', async (request, response) => {
  const { id } = request.params;
  const body = request.body as Troller;
  const { status, error, troller } = await update(id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(troller);
});

routes.put('/replaceOrder/:id', async (request, response) => {
  const { id } = request.params;
  const body = request.body as Troller;
  const { status, error, troller } = await replaceOrders(id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(troller);
});

routes.put('/checkout/:id', async (request, response) => {
  const { id } = request.params;
  // const paymentInfo = request.body as Payment;
  const paymentInfo = request.body;

  const { status, troller, error } = await checkout(id, paymentInfo);

  if (!!error) {
    return response.status(status).json({ error });
  }
  return response.status(status).json(troller);
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
