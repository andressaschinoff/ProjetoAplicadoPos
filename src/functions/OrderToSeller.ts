import { getRepository } from 'typeorm';
import OrderToSeller from '../models/OrderToSeller';
import Troller from '../models/Troller';
import User from '../models/User';
import { responseLog } from './Logs';

async function create(sellers: User[], troller: Troller) {
  try {
    const repository = getRepository(OrderToSeller);

    for (const seller of sellers) {
      const orderNumber = getOrderNumber();

      const created = repository.create({
        orderNumber,
        troller,
        user: seller,
      });

      await repository.save(created);

      const found = repository.findOne({ id: created.id });

      if (!found) {
        const err = new Error(
          `Relation between seller id ${seller.id} and order id ${troller.id} not established.`,
        );
        responseLog(err);
      }
      responseLog(undefined, found);
    }
  } catch (error) {
    responseLog(error);
    throw error;
  }
}

function getOrderNumber() {
  const sixNum = Math.floor(Math.random() * 100000);
  const fourNum = Math.floor(Math.random() * 1000);
  const date = Date.now();
  return `${fourNum}-${sixNum}-${fourNum}-${date}`;
}

export { create };
