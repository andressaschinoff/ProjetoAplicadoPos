import { EntityRepository, Repository, Like } from 'typeorm';

import Product from '../models/Product';

@EntityRepository(Product)
class ProductRepository extends Repository<Product> {
  public async findByDescription(
    description: string,
  ): Promise<Product[] | null> {
    const products = this.find({
      where: { description: Like(`%${description}%`) },
    });
    return products || null;
  }

  public async findByType(type: string): Promise<Product[] | null> {
    const products = await this.find({
      where: { type: Like(`%${type}%`) },
    });

    return products || null;
  }
}

export default ProductRepository;
