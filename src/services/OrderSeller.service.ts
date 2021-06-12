import { getRepository } from 'typeorm';
import { responseLog } from '../functions/Logs';
import OrderToSeller from '../models/OrderToSeller';
import Troller from '../models/Troller';
import User from '../models/User';

interface Request {
  orderNumber: string;
  seller: User;
  troller: Troller;
}

class CreateOrderSellerService {
  public async execute({
    orderNumber,
    seller,
    troller,
  }: Request): Promise<void> {
    const repository = getRepository(OrderToSeller);

    const relation = await repository.findOne({
      where: { troller: troller.id, user: seller.id },
    });

    if (!!relation) {
      responseLog(
        undefined,
        `Relation between seller id ${seller.id} and order id ${troller.id} already exist.`,
      );
      return;
    }

    const created = repository.create({
      active: true,
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
  }
}

export default CreateOrderSellerService;
