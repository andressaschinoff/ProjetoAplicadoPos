import { Router, Request, Response, NextFunction } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import OrderToSeller from '../models/OrderToSeller';
import Troller from '../models/Troller';
import User from '../models/User';
import TrollerRepository from '../repositories/Troller.repository';
import CreateOrderItensService from '../services/OrderItens.service';
import CreateTrollerService from '../services/Troller.service';
import { privateKey } from './Login.route';

const routes = Router();

const orderid = require('order-id')(privateKey);

// function logRequest(request: Request, _response: Response, next: NextFunction) {
//   const { method, originalUrl } = request;
//   console.info(method + ': ' + originalUrl);
//   return next();
// }

// routes.use(logRequest);

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

routes.get('/active', async (request, response) => {
  try {
    const { id } = request.query;

    const trollerRepository = getRepository(Troller);
    const trollerService = new CreateTrollerService();

    if (!!id) {
      const troller = await trollerRepository.findOne({
        where: { user: { id }, active: true },
      });

      if (!troller) {
        // find user

        // const createTroller = await trollerService.execute({ user: { id: id } });
        // return response.json(createTroller);
        return response.json({});
      }

      return response.json(troller);
    }

    const troller = await trollerRepository.findOne({
      where: { user: { id: null }, active: true },
    });

    if (!troller) {
      const createTroller = await trollerService.execute({});

      return response.json(createTroller);
    }

    return response.json(troller);
  } catch (error) {}
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

routes.get('/user/:role/:id/', async (request, response) => {
  try {
    const { id, role } = request.params;

    const trollerRepository = getRepository(Troller);
    if (role === 'seller') {
      const userRepository = getRepository(User);
      // const inactives = await userRepository.find({relations: ['']})

      // const inactives = await trollerRepository.find({
      //   relations: ['sellers'],
      //   where: {sellers: {} },
      //   // where: { sellers: { id }, active: false },
      // });

      const inactives = await trollerRepository
        .createQueryBuilder('troller')
        .leftJoin('troller.sellers', 'seller')
        .where('seller.id = :id', { id: id })
        .andWhere('troller.active = :active', { active: false })
        .getMany();

      const actives = await trollerRepository
        .createQueryBuilder('troller')
        .leftJoin('troller.sellers', 'seller')
        .where('seller.id = :id', { id: id })
        .andWhere('troller.active = :active', { active: true })
        .getMany();

      // const active = await trollerRepository.find({
      //   where: { sellers: {}, active: true },
      // });
      return response.json({ actives, inactives });
    }

    // const troller = await trollerRepository
    //   .createQueryBuilder('troller')
    //   .leftJoinAndSelect('troller.user', 'user')
    //   .leftJoinAndSelect('troller.fair', 'fair')
    //   .leftJoinAndSelect('troller.orderItens', 'orderItem')
    //   .leftJoinAndSelect('orderItem.product', 'product')
    //   .where('troller.userId = :id', { id: id })
    //   .getMany();

    const inactives = await trollerRepository.find({
      where: { user: { id }, active: false },
    });

    const actives = await trollerRepository.find({
      where: { user: { id }, active: true },
    });

    return response.json({ actives, inactives });
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

routes.put('/checkout/:id', async (request, response) => {
  try {
    const { id } = request.params;
    // const paymentInfo = request.body as Payment;
    const paymentInfo = request.body;

    const trollerRepository = getCustomRepository(TrollerRepository);
    const orderToSellerRepository = getRepository(OrderToSeller);

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

    for (const seller of sellers) {
      const orderNumber = orderid.generate();

      const orderToSeller = orderToSellerRepository.create({
        orderNumber,
        troller,
        user: seller,
      });

      await orderToSellerRepository.save(orderToSeller);
    }

    // troller.sellers = sellers;
    // troller.active = false;

    // await trollerRepository.save(troller);

    await trollerRepository.update(id, { active: false });

    const updatedTroller = await trollerRepository.findOne({
      where: { id },
    });
    console.log(updatedTroller);

    return response.json(updatedTroller);
  } catch (err) {
    // log erro
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

// routes.delete('/:id', async (request, response) => {
//   try {
//     const { id } = request.params;

//     const trollerRepository = getRepository(Troller);
//     await trollerRepository.update(id, { active: false });

//     return response.status(204).json();
//   } catch (err) {
//     console.error(err);
//     return response.status(400).json({ error: err.message });
//   }
// });

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
