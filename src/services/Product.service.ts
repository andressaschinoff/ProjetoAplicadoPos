import { getCustomRepository } from 'typeorm';

import { Type } from '../enum/Type';
import Product from '../models/Product';
import ProductRepository from '../repositories/Product.repository';

interface Request {
  name: string;
  price: number;
  description: string;
  type: Type;
}

class CreateProductService {
  public async execute({
    name,
    price,
    description,
    type,
  }: Request): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = productsRepository.create({
      name,
      price,
      description,
      type,
    });
    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
