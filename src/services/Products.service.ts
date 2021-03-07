import { getRepository } from 'typeorm';
import Product from '../models/Product';

import Products from '../models/Products';

interface Request {
  quantity: number;
  product: Product;
}

class CreateProductsService {
  public async execute({ quantity, product }: Request): Promise<Products> {
    const productsRepository = getRepository(Products);

    const products = productsRepository.create({
      quantity,
      total: product.price * quantity,
      product,
    });
    await productsRepository.save(products);
    return products;
  }
}

export default CreateProductsService;
