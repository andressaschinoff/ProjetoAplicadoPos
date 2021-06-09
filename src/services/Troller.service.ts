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

    const createdTroller = trollerRepository.create({
      user,
    });
    await trollerRepository.save(createdTroller);

    const troller = await trollerRepository.findOne({
      id: createdTroller.id,
    });

    if (!troller) {
      return createdTroller;
    }

    return troller;
  }
}

export default CreateTrollerService;
