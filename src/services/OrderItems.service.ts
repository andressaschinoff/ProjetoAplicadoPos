import { getCustomRepository, getRepository } from 'typeorm';
import Product from '../models/Product';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import ProductRepository from '../repositories/Product.repository';
import { responseLog } from '../functions/Logs';

interface Request {
  id?: string;
  quantity: number;
  product: Product;
  troller: Troller;
}

class CreateOrderItemsService {
  public async execute({
    id,
    quantity,
    product,
    troller,
  }: Request): Promise<void> {
    const orderItemRepo = getRepository(OrderItem);
    const productRepository = getCustomRepository(ProductRepository);

    const findedProd = await productRepository.findOne({
      where: { id: product.id },
    });

    if (!findedProd) {
      throw new Error(`Error while looking for product id ${product.id}`);
    }

    if (!!id) {
      const orderItem = await orderItemRepo.findOne({
        where: { id },
      });
      if (!!orderItem) {
        const qty = quantity + orderItem.quantity;
        const total = findedProd.price * qty;
        await orderItemRepo.update(orderItem.id, {
          quantity: qty,
          total: total,
        });
        return;
      }
    }

    const order = await orderItemRepo.findOne({
      where: { product: { id: product.id }, troller: { id: troller.id } },
      relations: ['troller'],
    });

    if (!!order) {
      const qty = order.quantity + quantity;
      const total = findedProd.price * qty;
      await orderItemRepo.update(order.id, { quantity: qty, total });
      return;
    }

    const total = quantity * findedProd.price;
    const newOrderItems = orderItemRepo.create({
      quantity,
      total,
      product: findedProd,
      troller,
    });

    await orderItemRepo.save(newOrderItems);
  }
}

export default CreateOrderItemsService;
