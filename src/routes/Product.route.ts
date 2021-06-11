import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { getUserByToken, isSeller } from '../functions/Auth';
import { responseLog } from '../functions/Logs';
import {
  create,
  getAll,
  getOne,
  getByFair,
  remove,
  update,
} from '../functions/Products';
import Product from '../models/Product';

import ProductRepository from '../repositories/Product.repository';
import { ProductRequest } from '../services/Product.service';

const routes = Router();

routes.get('/', async (_request, response) => {
  const { status, error, products } = await getAll();

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(products);
});

routes.get('/:fairId', async (request, response) => {
  const { fairId } = request.params;
  const { status, error, products } = await getByFair(fairId);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(products);
});

routes.post('/:fairId', getUserByToken, isSeller, async (request, response) => {
  const { fairId } = request.params;
  const body = request.body as ProductRequest;

  const { status, error, product } = await create(fairId, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(product);
});

routes.get('/one/:id', async (request, response) => {
  const { id } = request.params;
  const { status, error, product } = await getOne(id);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(product);
});

routes.get('/filter', async (request, response) => {
  try {
    const { name, description, type } = request.query;
    const filter: string = description
      ? String(description)
      : name
      ? String(name)
      : type
      ? String(type)
      : '';

    const key = name ? 'name' : 'description';

    const productRepository = getCustomRepository(ProductRepository);
    const products = type
      ? await productRepository.findByType(filter)
      : await productRepository.findBy(key, filter);

    return response.json(products);
  } catch (err) {
    responseLog(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', getUserByToken, isSeller, async (request, response) => {
  const { id } = request.params;
  const body = request.body as Partial<Product> | Product;
  const { status, error, product } = await update(id, body);

  if (status !== 200) {
    return response.status(status).json({ error });
  }

  return response.status(status).json(product);
});

routes.delete('/:id', getUserByToken, isSeller, async (request, response) => {
  const { id } = request.params;
  const { status, error } = await remove(id);

  if (status !== 204) {
    return response.status(status).json({ error });
  }

  return response.status(status).end();
});

export { routes as productRoute };
