import { getRepository } from 'typeorm';
import Client from '../models/Client';

import Products from '../models/Products';
import Troller from '../models/Troller';

interface Request {
  products?: Products[];
  client: Client;
  active?: boolean;
}

class CreateTrollerService {
  public async execute({
    products,
    client,
    active,
  }: Request): Promise<Troller> {
    const trollerRepository = getRepository(Troller);

    const troller = trollerRepository.create({
      products,
      client,
      active,
      total: products?.reduce((acc, curr) => acc + curr.total, 0),
    });
    await trollerRepository.save(troller);
    return troller;
  }
}

export default CreateTrollerService;
