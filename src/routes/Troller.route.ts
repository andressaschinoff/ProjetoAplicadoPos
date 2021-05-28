import {
  Router,
  Request,
  Response,
  NextFunction,
  request,
  response,
} from 'express';
import {
  createQueryBuilder,
  getConnection,
  getCustomRepository,
  getManager,
  getRepository,
  IsNull,
} from 'typeorm';
// import Client from '../models/Client';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import Troller from '../models/Troller';
import User from '../models/User';
import TrollerRepository from '../repositories/Troller.repository';
import CreateOrderItensService from '../services/OrderItens.service';

import CreateTrollerService from '../services/Troller.service';
// import { getAllTrollers, getTrollerActive } from './User.route';

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

    const trollerService = new CreateTrollerService();

    const troller = await trollerService.execute({ ...req });

    return response.json(troller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/empty', async (_request, response) => {
  try {
    const trollerRepository = getRepository(Troller);

    const emptyTroller = await trollerRepository
      .createQueryBuilder('troller')
      .leftJoinAndSelect('troller.user', 'user')
      .leftJoinAndSelect('troller.fair', 'fair')
      .leftJoinAndSelect('troller.orderItens', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('troller.active = :active', { active: true })
      .andWhere('troller.userId is null')
      .getOne();
    // const emptyTroller = await trollerRepository.findOne({
    //   where: { user: { id: null } },
    // });

    if (!emptyTroller) {
      const trollerService = new CreateTrollerService();

      const troller = await trollerService.execute({});

      const emptyTroller = await trollerRepository
        .createQueryBuilder('troller')
        .leftJoinAndSelect('troller.user', 'user')
        .leftJoinAndSelect('troller.fair', 'fair')
        .leftJoinAndSelect('troller.orderItens', 'orderItem')
        .leftJoinAndSelect('orderItem.product', 'product')
        .where('troller.id = :id', { id: troller.id })
        .getOne();

      return response.json(emptyTroller);
    }

    return response.json(emptyTroller);
  } catch (error) {}
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);

    const troller = await trollerRepository
      .createQueryBuilder('troller')
      .leftJoinAndSelect('troller.user', 'user')
      .leftJoinAndSelect('troller.fair', 'fair')
      .leftJoinAndSelect('troller.orderItens', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('troller.active = :active', { active: true })
      .andWhere('troller.userId = :id', { id: id })
      .getOne();

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { orderItens, fair, user } = request.body as Troller;

    const orderItemService = new CreateOrderItensService();
    const trollerRepository = getCustomRepository(TrollerRepository);

    const findedTroller = await trollerRepository.findOne({ where: { id } });

    if (!findedTroller) {
      return response
        .status(401)
        .json({ error: `Troller id ${id} not finded.` });
    }

    if (orderItens !== undefined && orderItens.length > 0) {
      for (const orderItem of orderItens) {
        await orderItemService.execute({
          ...orderItem,
          troller: findedTroller,
        });
      }
    }

    const updateTroller = await trollerRepository.customUpdate(id, user, fair);

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
    await trollerRepository.update(id, { active: false });

    return response.status(204).json();
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.delete('/exclude/:id', async (request, response) => {
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
