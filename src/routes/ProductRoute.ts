import { Router, Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import dateFormat from 'dateformat';
import { parseISO } from 'date-fns';

import ProductRepository from '../repositories/ProductRepository';
import CreateProductService from '../services/ProductService';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.log(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.get('/', async (_request, response) => {
  const productRepository = getCustomRepository(ProductRepository);
  const products = await productRepository.find();

  return response.json(products);
});

routes.post('/', async (request, response) => {
  try {
    const { name, type, price, description } = request.body;
    const date = new Date();
    const parsedDate = parseISO(dateFormat(date, 'isoDateTime'));

    const newProduct = new CreateProductService();

    const product = await newProduct.execute({
      name,
      type,
      price,
      description,
      dateInc: parsedDate,
      dateAlt: parsedDate,
    });

    return response.json(product);
  } catch (err) {
    // log erro
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findOne({
      where: { id },
    });

    return response.json(product);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/filter/?description', async (request, response) => {
  try {
    const { description } = request.query;

    const filter: string = description ? String(description) : '';

    const productRepository = getCustomRepository(ProductRepository);
    const products = await productRepository.findByDescription(filter);

    return products;
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/filter/?type', async (request, response) => {
  try {
    const { type } = request.query;

    const filter: string = type ? String(type) : '';

    const productRepository = getCustomRepository(ProductRepository);
    const products = await productRepository.findByType(filter);

    return products;
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, type, description, price } = request.body;

    const date = new Date();
    const parsedDate = parseISO(dateFormat(date, 'isoDateTime'));

    const productRepository = getCustomRepository(ProductRepository);
    await productRepository.update(id, {
      name,
      type,
      price,
      description,
      dateAlt: parsedDate,
    });

    const updateProduct = await productRepository.findOne({ where: { id } });

    return response.json(updateProduct);
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export { routes as productRoute };
