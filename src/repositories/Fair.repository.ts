import { EntityRepository, Repository, Like, MoreThan, In } from 'typeorm';
import { responseLog } from '../functions/Logs';

import Fair from '../models/Fair';

@EntityRepository(Fair)
class FairRepository extends Repository<Fair> {
  public async findByName(filter: string): Promise<Fair[] | null> {
    const fairs = await this.find({ where: { name: Like(`%${filter}%`) } });
    return fairs || null;
  }

  public async findByArray(
    key: string,
    filter: string,
  ): Promise<Fair[] | null> {
    try {
      const fairs = await this.find({
        where: { products: In([Like(`%${filter}%`)]) },
      });
      return fairs || null;
    } catch (error) {
      responseLog(error);
      return null;
    }
  }

  public async findByOpening(): Promise<Fair[] | null> {
    try {
      const fairs = await this.find({
        where: { opening: MoreThan(new Date().getTime()) },
      });
      return fairs || null;
    } catch (error) {
      responseLog(error);
      return null;
    }
  }
}

export default FairRepository;
