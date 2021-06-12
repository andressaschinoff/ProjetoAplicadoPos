import { getCustomRepository } from 'typeorm';

import { Type } from '../enum/Type';
import Fair from '../models/Fair';
import Product from '../models/Product';
import ProductRepository from '../repositories/Product.repository';

export interface ProductRequest {
  name: string;
  price: number;
  description?: string;
  countInStock?: number;
  image?: string;
  type: Type;
  unitsOfMeasure: string;
}

class CreateProductService {
  public async execute(
    {
      name,
      price,
      description,
      type,
      unitsOfMeasure,
      countInStock,
      image,
    }: ProductRequest,
    fair: Fair,
  ): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = productsRepository.create({
      name,
      price,
      description,
      type,
      fair,
      countInStock,
      image,
      unitsOfMeasure,
    });
    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
