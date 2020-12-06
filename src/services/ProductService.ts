import { getCustomRepository } from 'typeorm';

import Product from '../models/Product';
import ProductRepository from '../repositories/ProductRepository';

interface Request {
  name: string;
  price: number;
  type: string;
  description: string;
  dateInc: Date;
  dateAlt: Date;
}

class CreateProductService {
  public async execute({
    name,
    price,
    type,
    description,
    dateInc,
    dateAlt,
  }: Request): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = productsRepository.create({
      name,
      price,
      type,
      description,
      dateInc,
      dateAlt,
    });
    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
