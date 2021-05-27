import { getCustomRepository, getRepository } from 'typeorm';
import Product from '../models/Product';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import ProductRepository from '../repositories/Product.repository';

interface Request {
  quantity: number;
  product: Product;
  troller: Troller;
}

class CreateOrderItensService {
  public async execute({ quantity, product, troller }: Request): Promise<void> {
    const orderItemRepo = getRepository(OrderItem);
    const productRepository = getCustomRepository(ProductRepository);

    const findedProd = await productRepository.findOne({
      where: { id: product.id },
    });

    if (!findedProd) {
      console.log('here');
      throw new Error(`Error while looking for product id ${product.id}`);
    }

    const orderItens = await orderItemRepo.find({
      where: { troller: { id: troller.id }, product: { id: product.id } },
    });

    if (!!orderItens && orderItens.length > 0) {
      for (const orderItem of orderItens) {
        console.log(orderItem);
        await orderItemRepo.update(orderItem.id, {
          quantity,
          total: findedProd.price * quantity,
          product: findedProd,
          troller,
        });
      }
      return;
    }

    const newProducts = orderItemRepo.create({
      quantity,
      total: findedProd.price * quantity,
      product: findedProd,
      troller,
    });

    console.log(newProducts);

    await orderItemRepo.save(newProducts);
  }
}

export default CreateOrderItensService;
