import { EntityRepository, getRepository, Repository } from 'typeorm';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import User from '../models/User';

@EntityRepository(Troller)
class TrollerRepository extends Repository<Troller> {
  public async customUpdate(id: string, user?: User): Promise<Troller | null> {
    try {
      const trollerRepository = getRepository(Troller);
      const orderItemRepo = getRepository(OrderItem);

      const orderItens = await orderItemRepo.find({
        where: { troller: { id } },
      });
      console.log(orderItens);

      let currentUser = user;

      if (!currentUser) {
        const oldTroller = await trollerRepository.findOne({ where: { id } });
        currentUser = oldTroller?.user;
      }

      await trollerRepository.update(id, {
        user: currentUser,
        total: orderItens?.reduce((acc, curr) => acc + curr.total, 0),
      });

      const troller = await trollerRepository.findOne({
        where: { id },
        relations: ['orderItens', 'user'],
      });

      if (!troller) {
        throw new Error(`Error while is updating troller id ${id}`);
      }

      return troller;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default TrollerRepository;
