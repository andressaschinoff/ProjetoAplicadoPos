import { EntityRepository, getRepository, Repository } from 'typeorm';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import Troller from '../models/Troller';

@EntityRepository(Troller)
class TrollerRepository extends Repository<Troller> {
  public async customUpdate(
    id: string,
    troller: Troller | Partial<Troller>,
  ): Promise<Troller> {
    try {
      const trollerRepo = getRepository(Troller);
      const current = await trollerRepo.findOne({ id });

      if (!current) {
        throw new Error(`Troller id ${id} not found.`);
      }

      const orderRepo = getRepository(OrderItem);
      const orderItems = await orderRepo.find({
        where: { troller: { id } },
        relations: ['troller'],
      });

      const { user: currentUser, fair: currentFair } = current;

      const { user } = troller;

      if (!currentUser && !!user) {
        current.user = user;
      }

      if (!currentFair && !!orderItems[0]) {
        const productId = orderItems[0].product.id;
        const prodRepo = getRepository(Product);
        const product = await prodRepo.findOne({
          where: { id: productId },
          relations: ['fair'],
        });
        if (!!product) {
          const fair = product.fair;
          current.fair = fair;
        }
      }

      const delivery = current.fair?.deliveryPrice || 10;

      const subtotal = orderItems.reduce((acc, curr) => acc + curr.total, 0);
      const total = subtotal + delivery;

      await trollerRepo.update(id, {
        fair: current.fair,
        user: current.user,
        active: troller.active,
        subtotal,
        total,
      });

      const updated = await trollerRepo.findOne({ where: { id } });

      if (!updated) {
        throw new Error(`Error while is updating troller id ${id}`);
      }

      return updated;
    } catch (error) {
      throw error;
    }
  }
}

export default TrollerRepository;
