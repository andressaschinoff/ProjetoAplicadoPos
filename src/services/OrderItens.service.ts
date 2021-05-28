import { getCustomRepository, getRepository } from 'typeorm';
import Product from '../models/Product';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import ProductRepository from '../repositories/Product.repository';

interface Request {
  id?: string;
  quantity: number;
  product: Product;
  troller: Troller;
}

class CreateOrderItensService {
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

    const total = findedProd.price * quantity;

    if (!!id) {
      const orderItem = await orderItemRepo.findOne({
        where: { id },
      });
      if (!!orderItem) {
        await orderItemRepo.update(orderItem.id, {
          quantity,
          total,
        });
        return;
      }
    }

    const newOrderItens = orderItemRepo.create({
      quantity,
      total,
      product: findedProd,
      troller,
    });

    await orderItemRepo.save(newOrderItens);
  }
}

export default CreateOrderItensService;
