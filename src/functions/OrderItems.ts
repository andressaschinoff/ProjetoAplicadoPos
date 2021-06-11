import { getRepository } from 'typeorm';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import CreateOrderItemsService from '../services/OrderItems.service';
import { responseLog } from './Logs';

async function create(orderItems: OrderItem[], troller: Troller) {
  try {
    const orderItemService = new CreateOrderItemsService();

    for (const orderItem of orderItems) {
      await orderItemService.execute({
        ...orderItem,
        troller,
      });
    }
    responseLog(undefined, {
      orderItems: 'Relation between order item and troller succeeded.',
    });
  } catch (error) {
    responseLog(error);
  }
}

async function deleteAll(id: string) {
  try {
    const repository = getRepository(OrderItem);
    const orders = await repository.find({
      where: { troller: { id } },
      relations: ['troller'],
    });

    for (const order of orders) {
      await repository.delete(order.id);
    }

    const remainders = await repository.find({
      where: { troller: { id } },
      relations: ['troller'],
    });

    if (!!remainders) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    responseLog(error);
    return { success: false };
  }
}

export { create, deleteAll };
