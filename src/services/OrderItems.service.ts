import { getCustomRepository, getRepository } from 'typeorm';
import Product from '../models/Product';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import ProductRepository from '../repositories/Product.repository';
import { responseLog } from '../functions/Logs';

interface Request {
  quantity: number;
  product: Product;
  troller: Troller;
}

class CreateOrderItemsService {
  public async execute({ quantity, product, troller }: Request): Promise<void> {
    const orderItemRepo = getRepository(OrderItem);
    const productRepository = getCustomRepository(ProductRepository);

    const findedProd = await productRepository.findOne({
      where: { id: product.id },
    });

    if (!findedProd) {
      throw new Error(`Error while looking for product id ${product.id}`);
    }

    const order = await orderItemRepo.findOne({
      where: { product: { id: product.id }, troller: { id: troller.id } },
      relations: ['troller'],
    });

    if (!order) {
      if (quantity <= 0) {
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

      const created = orderItemRepo.findOne({ id: newOrderItems.id });

      if (!created) {
        const err = new Error(
          `Relation between troller ${troller.id} and order item not established.`,
        );
        responseLog(err);
      }
      return;
    }

    const qty = order.quantity + quantity;

    if (qty <= 0) {
      await orderItemRepo.delete(order.id);
      return;
    }

    const total = findedProd.price * qty;
    await orderItemRepo.update(order.id, { quantity: qty, total });
  }
}

export default CreateOrderItemsService;
