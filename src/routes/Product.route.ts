import { Router, Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import dateFormat from 'dateformat';
import { parseISO } from 'date-fns';

import ProductRepository from '../repositories/Product.repository';
import CreateProductService from '../services/Product.service';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.get('/', async (_request, response) => {
  try {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();

    return response.json(products);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:fair', async (request, response) => {
  try {
    const { fair } = request.params;

    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find({ where: { fair: fair } });

    return response.json(products);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.post('/', async (request, response) => {
  try {
    const { name, type, price, description, fair } = request.body;

    const newProduct = new CreateProductService();

    const product = await newProduct.execute({
      name,
      type,
      price,
      description,
      fair,
    });

    return response.json(product);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findByIds([id]);

    return response.json(product);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
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
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, type, description, price, fair } = request.body;

    const date = new Date();
    // const parsedDate = parseISO(dateFormat(date, 'isoDateTime'));

    const productRepository = getCustomRepository(ProductRepository);

    await productRepository.update(id, {
      name,
      type,
      price,
      description,
      fair,
    });

    const updateProduct = await productRepository.findByIds([id]);

    return response.json(updateProduct);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const productRepository = getCustomRepository(ProductRepository);
    await productRepository.delete(id);

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as productRoute };
