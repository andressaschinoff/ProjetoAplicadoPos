import { Router, Request, Response, NextFunction } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { linkWhats } from '../functions/Whatsapp';
import Troller from '../models/Troller';
import User from '../models/User';
import TrollerRepository from '../repositories/Troller.repository';
import CreateOrderItensService from '../services/OrderItens.service';
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

    const trollerService = new CreateTrollerService();

    const troller = await trollerService.execute({ ...req });

    return response.json(troller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.post('/buy/:id', async (request, response) => {
  try {
    const { id } = request.params;
    // const paymentInfo = request.body as Payment;
    const paymentInfo = request.body;

    const trollerRepository = getCustomRepository(TrollerRepository);

    const troller = await trollerRepository.findOne({
      where: { id },
    });

    if (!troller) {
      return response
        .status(401)
        .json({ error: `Troller id ${id} not finded.` });
    }

    const userRepository = getRepository(User);

    const idFair = troller.fair.id;
    console.log('fairId');
    console.log(idFair);

    const sellers = await userRepository.find({
      where: { fair: { id: idFair } },
    });

    troller.sellers = sellers;
    troller.active = false;

    await trollerRepository.save(troller);

    const newTroller = await trollerRepository.findOne({
      where: { id },
    });
    console.log(newTroller);

    return response.json(newTroller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/empty', async (_request, response) => {
  try {
    const trollerRepository = getRepository(Troller);

    const troller = await trollerRepository.findOne({
      where: { user: { id: null }, active: true },
    });

    if (!troller) {
      const trollerService = new CreateTrollerService();

      const createTroller = await trollerService.execute({});

      const newTroller = await trollerRepository.findOne({
        id: createTroller.id,
      });

      return response.json(newTroller);
    }

    return response.json(troller);
  } catch (error) {}
});

routes.get('/user/:id/active', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);

    const troller = await trollerRepository.findOne({
      where: { user: { id }, active: true },
    });

    // create one if anyone was found

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);

    const troller = await trollerRepository.findOne({ id });

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/user/:id/all', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);

    const troller = await trollerRepository
      .createQueryBuilder('troller')
      .leftJoinAndSelect('troller.user', 'user')
      .leftJoinAndSelect('troller.fair', 'fair')
      .leftJoinAndSelect('troller.orderItens', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('troller.userId = :id', { id: id })
      .getMany();

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

    const trollerRepository = getCustomRepository(TrollerRepository);

    const findedTroller = await trollerRepository.findOne({ where: { id } });

    if (!findedTroller) {
      return response
        .status(401)
        .json({ error: `Troller id ${id} not finded.` });
    }

    const orderItemService = new CreateOrderItensService();

    if (!!orderItens && orderItens.length > 0) {
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
