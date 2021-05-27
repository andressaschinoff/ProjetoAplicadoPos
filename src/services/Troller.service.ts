import { getRepository } from 'typeorm';
import User from '../models/User';

import OrderItem from '../models/OrderItem';
import Troller from '../models/Troller';

interface Request {
  user?: User;
}

class CreateTrollerService {
  public async execute({ user }: Request): Promise<Troller> {
    const trollerRepository = getRepository(Troller);

    const troller = trollerRepository.create({
      user,
    });
    await trollerRepository.save(troller);
    return troller;
  }
}

export default CreateTrollerService;
