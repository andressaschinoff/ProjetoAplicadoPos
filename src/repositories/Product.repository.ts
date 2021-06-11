import { EntityRepository, Repository, Like } from 'typeorm';
import { responseLog } from '../functions/Logs';

import Product from '../models/Product';

@EntityRepository(Product)
class ProductRepository extends Repository<Product> {
  public async findBy(key: string, filter: string): Promise<Product[] | null> {
    try {
      const products =
        key === 'name'
          ? await this.find({
              where: { name: Like(`%${filter}%`) },
            })
          : await this.find({
              where: { description: Like(`%${filter}%`) },
            });
      return products || null;
    } catch (error) {
      responseLog(error);
      return null;
    }
  }

  public async findByType(filter: string): Promise<Product[] | null> {
    try {
      const products = await this.find({
        where: { type: filter },
      });
      return products || null;
    } catch (error) {
      responseLog(error);
      return null;
    }
  }
}

export default ProductRepository;
