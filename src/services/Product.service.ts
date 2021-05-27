import { getCustomRepository } from 'typeorm';

import { Type } from '../enum/Type';
import Fair from '../models/Fair';
import Product from '../models/Product';
import ProductRepository from '../repositories/Product.repository';

interface Request {
  name: string;
  price: number;
  description: string;
  type: Type;
  fair: Fair;
  unitsOfMeasure: string;
}

class CreateProductService {
  public async execute({
    name,
    price,
    description,
    type,
    fair,
    unitsOfMeasure,
  }: Request): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = productsRepository.create({
      name,
      price,
      description,
      type,
      fair,
      unitsOfMeasure,
    });
    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
