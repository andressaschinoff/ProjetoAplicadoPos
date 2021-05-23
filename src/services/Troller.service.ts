import { getRepository } from 'typeorm';
import User from '../models/User';

import Products from '../models/Products';
import Troller from '../models/Troller';

interface Request {
  products?: Products[];
  user?: User;
  active?: boolean;
}

class CreateTrollerService {
  public async execute({ user, products, active }: Request): Promise<Troller> {
    const trollerRepository = getRepository(Troller);

    const troller = trollerRepository.create({
      products,
      user,
      active,
      total: products?.reduce((acc, curr) => acc + curr.total, 0),
    });
    await trollerRepository.save(troller);
    return troller;
  }
}

export default CreateTrollerService;
