import { EntityRepository, getRepository, Repository } from 'typeorm';
import Fair from '../models/Fair';
import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';
import User from '../models/User';

@EntityRepository(Troller)
class TrollerRepository extends Repository<Troller> {
  public async customUpdate(
    id: string,
    user?: User,
    fair?: Fair,
  ): Promise<Troller | null> {
    try {
      const trollerRepository = getRepository(Troller);
      const orderItemRepo = getRepository(OrderItem);

      const orderItens = await orderItemRepo.find({
        where: { troller: { id } },
      });

      let currentUser = user;

      if (!currentUser) {
        const oldTroller = await trollerRepository.findOne({
          where: { id },
          relations: ['user'],
        });
        currentUser = oldTroller?.user;
      }
      console.log(fair);

      const subtotal = orderItens?.reduce((acc, curr) => acc + curr.total, 0);
      const total =
        subtotal + (!!fair?.deliveryPrice ? fair?.deliveryPrice : 10);

      await trollerRepository.update(id, {
        fair,
        user: currentUser,
        subtotal,
        total,
      });

      const troller = await trollerRepository
        .createQueryBuilder('troller')
        .leftJoinAndSelect('troller.user', 'user')
        .leftJoinAndSelect('troller.fair', 'fair')
        .leftJoinAndSelect('troller.orderItens', 'orderItem')
        .leftJoinAndSelect('orderItem.product', 'product')
        .where('troller.id = :id', { id: id })
        .getOne();

      console.log(troller);

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
