import {
  Router,
  Request,
  Response,
  NextFunction,
  request,
  response,
} from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
// import Client from '../models/Client';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import User from '../models/User';
import TrollerRepository from '../repositories/Troller.repository';
import CreateOrderItensService from '../services/OrderItens.service';

import CreateTrollerService from '../services/Troller.service';
import getTrollerActive from './User.route';

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

    const emptyTroller = await trollerRepository.findOne({
      where: { user: { id: null } },
    });

    if (!emptyTroller) {
      const trollerService = new CreateTrollerService();

      const troller = await trollerService.execute({});
      return response.json(troller);
    }

    return response.json(emptyTroller);
  } catch (error) {}
});

routes.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const trollerRepository = getRepository(Troller);
    const troller = await trollerRepository.find({
      where: { user: { id }, active: true },
    });

    return response.json(troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/user/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const trollerActive = await getTrollerActive(id);

    if (!!trollerActive?.error) {
      response.status(400).json({ error: trollerActive.error });
    }

    if (trollerActive?.troller?.length === 0) {
      const trollerService = new CreateTrollerService();
      const troller = await trollerService.execute({
        user: trollerActive?.user,
      });

      return response.json(troller);
    }
    return response.json(trollerActive.troller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

routes.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { orderItens, user } = request.body as Troller;

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
        console.log('before server');
        await orderItemService.execute({
          ...orderItem,
          troller: findedTroller,
        });
      }
      console.log('after server');
    }

    console.log('before troller update');

    const updateTroller = await trollerRepository.customUpdate(id, user);

    console.log('after troller update');

    console.log(updateTroller);

    return response.json(updateTroller);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ error: err.message });
  }
});

// routes.put('/:id', async (request, response) => {
//   try {
//     const { id } = request.params;
//     const { orderItens } = request.body as Troller;

//     const orderItemService = new CreateOrderItensService();
//     const trollerRepository = getCustomRepository(TrollerRepository);

//     const findedTroller = await trollerRepository.findOne({ where: { id } });

//     if (!findedTroller) {
//       return response
//         .status(401)
//         .json({ error: `Troller id ${id} not finded.` });
//     }

//     if (orderItens !== undefined && orderItens.length > 0) {
//       for (const orderItem of orderItens) {
//         console.log('before server');
//         await orderItemService.execute({
//           ...orderItem,
//           troller: findedTroller,
//         });
//       }
//       console.log('after server');
//     }

//     console.log('before troller update');

//     const updateTroller = await trollerRepository.customUpdate(id);

//     console.log('after troller update');

//     console.log(updateTroller);

//     return response.json(updateTroller);
//   } catch (err) {
//     console.error(err);
//     return response.status(400).json({ error: err.message });
//   }
// });

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
