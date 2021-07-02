import { getCustomRepository, getRepository } from 'typeorm';
import OrderToSeller from '../models/OrderToSeller';
import Troller from '../models/Troller';
import TrollerRepository from '../repositories/Troller.repository';
import CreateTrollerService from '../services/Troller.service';
import { responseLog } from './Logs';
import { getOne as getUser, getByFair as getUserByFair } from './User';
import {
  create as orderItemsRelation,
  deleteAll as deleteAllOrders,
} from './OrderItems';
import { create as orderSellerRelation } from './OrderToSeller';

async function getActive(id?: string) {
  try {
    if (!!id) {
      const { status, error, troller } = await getActiveByUser(id);

      if (status !== 200) {
        return { status, error };
      }

      return { status, troller };
    }

    const { status, error, troller } = await getActiveSignOut();

    if (status !== 200) {
      return { status, error };
    }

    return { status, troller };
  } catch (error) {
    responseLog();
    return { status: 400, error: error.message };
  }
}

async function getActiveByUser(id: string) {
  try {
    const repository = getRepository(Troller);
    const found = await repository.findOne({
      where: { user: { id }, active: true },
    });

    if (!found) {
      const userInfo = await getUser(id);

      if (userInfo.status !== 200) {
        return { status: userInfo.status, error: userInfo.error };
      }

      const { status, error, troller } = await create({ user: userInfo.user });

      if (status !== 200) {
        return { status, error };
      }

      return { status: 200, troller };
    }

    return { status: 200, troller: found };
  } catch (error) {
    responseLog(error);
    return { status: 400, error: error.message };
  }
}

async function getActiveSignOut() {
  try {
    const repository = getRepository(Troller);
    const found = await repository.findOne({
      where: { user: { id: null }, active: true },
    });

    if (!found) {
      const { status, error, troller } = await create({});

      if (status !== 200) {
        return { status, error };
      }

      return { status: 200, troller };
    }

    return { status: 200, troller: found };
  } catch (error) {
    responseLog(error);
    return { status: 400, error: error.message };
  }
}

async function create(body: Troller | Partial<Troller>) {
  try {
    const service = new CreateTrollerService();
    const { success, error, troller } = await service.execute({
      ...body,
    });

    if (!success) {
      responseLog(error);
      return { status: 501, error };
    }

    responseLog(undefined, troller);
    return { status: 200, troller };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getOne(id: string) {
  try {
    const repository = getRepository(Troller);

    const troller = await repository.findOne({ id });

    if (!troller) {
      const error = new Error(`Troller id ${id} not finded.`);
      responseLog(error);
      return { status: 404, error: error.message };
    }

    responseLog(undefined, troller);
    return { status: 200, troller };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getAllByUser(id: string) {
  try {
    const { status: userStatus, error: userError, user } = await getUser(id);

    if (userStatus !== 200) {
      return { status: userStatus, error: userError };
    }

    if (user?.role === 'seller') {
      const { status, error, trollers } = await getAllBySeller(id);

      if (status !== 200) {
        return { status, error };
      }

      return { status, trollers };
    }

    const { status, error, trollers } = await getAllByBuyer(id);

    if (status !== 200) {
      return { status, error };
    }

    return { status, trollers };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getAllBySeller(id: string) {
  try {
    const repository = getRepository(OrderToSeller);

    const inactivesOrders = await repository.find({
      where: { active: false, user: { id } },
    });
    const activesOrders = await repository.find({
      where: { active: true, user: { id } },
    });

    const inactives = inactivesOrders.map(({ troller, orderNumber }) => {
      return { ...troller, orderNumber };
    });
    const actives = activesOrders.map(({ troller, orderNumber }) => {
      return { ...troller, orderNumber };
    });

    responseLog(undefined, { trollers: { actives, inactives } });
    return { status: 200, trollers: { actives, inactives } };
  } catch (error) {
    responseLog(error);
    return { status: 400, error: error.message };
  }
}

async function getAllByBuyer(id: string) {
  try {
    const repository = getRepository(Troller);
    const inactives = await repository.find({
      where: { user: { id }, active: false },
    });

    const actives = await repository.find({
      where: { user: { id }, active: true },
    });

    responseLog(undefined, { trollers: { actives, inactives } });
    return { status: 200, trollers: { actives, inactives } };
  } catch (error) {
    responseLog(error);
    return { status: 501, error: error.message };
  }
}

async function checkout(id: string, paymentInfo: any) {
  try {
    const repository = getRepository(Troller);
    const {
      status: currentStatus,
      error: currentError,
      troller: currentTroller,
    } = await getOne(id);

    if (currentStatus !== 200 || !currentTroller) {
      return { status: currentStatus, error: currentError };
    }

    const fairId = currentTroller.fair.id;
    const {
      status: usersStatus,
      error: usersError,
      seller,
    } = await getUserByFair(fairId);

    if (usersStatus !== 200 || !seller) {
      return { status: usersStatus, error: usersError };
    }

    await orderSellerRelation(seller, currentTroller);

    await repository.update(id, { active: false });
    const updated = await repository.findOne({ where: { id } });

    if (!updated) {
      return { status: 400, error: `Troller ${id} could update.` };
    }

    return { status: 200, troller: updated };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function update(id: string, troller: Troller | Partial<Troller>) {
  try {
    const customRepository = getCustomRepository(TrollerRepository);

    const {
      status: currentStatus,
      error: currentError,
      troller: currentTroller,
    } = await getOne(id);

    if (currentStatus !== 200 || !currentTroller) {
      return { status: currentStatus, error: currentError };
    }

    const { orderItems, user } = troller;

    if (!!user) {
      const {
        status: userStatus,
        error: userError,
        user: foundUser,
      } = await getUser(user.id);

      if (userStatus !== 200 || !foundUser) {
        return { status: userStatus, error: userError };
      }

      const { troller: activeTroller } = await getActiveByUser(foundUser.id);

      if (!!activeTroller && activeTroller.id !== id) {
        await customRepository.update(activeTroller.id, { active: false });
      }
    }

    if (!!orderItems && orderItems.length > 0) {
      await orderItemsRelation(orderItems, currentTroller);
    }

    const updateTroller = await customRepository.customUpdate(id, troller);

    responseLog(undefined, { troller: updateTroller });
    return { status: 200, troller: updateTroller };
  } catch (err) {
    responseLog(err);
    return { status: 501, error: err.message };
  }
}

async function replaceOrders(id: string, troller: Troller | Partial<Troller>) {
  try {
    const repository = getRepository(Troller);

    const current = await repository.findOne({ id });

    if (!current) {
      const err = new Error(`Troller ${id} wasn't found.`);
      responseLog(err);
      return { status: 400, error: err.message };
    }

    const { success } = await deleteAllOrders(id);

    if (!success) {
      const err = new Error(`Orders of troller ${id} weren't deleted.`);
      responseLog(err);
      return { status: 400, error: err.message };
    }

    const { status, error, troller: updatedTroller } = await update(
      id,
      troller,
    );

    if (status !== 200) {
      return { error, status };
    }

    return { status, troller: updatedTroller };
  } catch (error) {
    return { status: 400, error: error.message };
  }
}

export {
  getActive,
  getActiveByUser,
  getActiveSignOut,
  create,
  getOne,
  getAllByUser,
  update,
  checkout,
  replaceOrders,
};
