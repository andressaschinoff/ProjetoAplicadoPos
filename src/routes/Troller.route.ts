import { Router, Request, Response, NextFunction, request } from 'express';
import { getRepository } from 'typeorm';
// import Client from '../models/Client';
import Products from '../models/Products';
import Troller from '../models/Troller';
import User from '../models/User';
import CreateProductsService from '../services/Products.service';

import CreateTrollerService from '../services/Troller.service';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.post('/', async (request, response) => {
  try {
    const req = request.body;

    const newTroller = new CreateTrollerService();

    const troller = await newTroller.execute({ ...req });

    return response.json(troller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);
    const troller = await trollerRepository.findByIds([id]);

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const {
      products,
      user,
      active,
    }: {
      products?: Products[];
      user?: User;
      // client?: Client;
      active?: boolean;
    } = request.body;

    const productsService = new CreateProductsService();
    const newProducts: Products[] = [];
    const newTroller = { products, active, user };
    // const newTroller = { products, active, client };

    if (products !== undefined) {
      for (let i = 0; i < products.length; i++) {
        const currentProduct = products[i];
        const newProduct = await productsService.execute({
          product: currentProduct.product,
          quantity: currentProduct.quantity,
        });
        console.log(newProduct);
        newProducts.push(newProduct);
      }
      newTroller.products = newProducts;
      console.log(newProducts);
    }

    const trollerRepository = getRepository(Troller);

    await trollerRepository.update(id, {
      ...newTroller,
    });

    const updateTroller = await trollerRepository.findByIds([id]);

    return response.json(updateTroller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
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
