import { getCustomRepository } from 'typeorm';

import Fair from '../models/Fair';
import Product from '../models/Product';
import FairRepository from '../repositories/Fair.repository';

interface Request {
  name: string;
  zipcode: number;
  address: string;
  score: number;
  opening: string;
  closing: string;
  weekDay: string;
  deliveryPrice: number;
  moneySign: number;
  products: Product[];
}

class CreateFairService {
  public async execute({
    name,
    zipcode,
    address,
    score,
    opening,
    closing,
    weekDay,
    deliveryPrice,
    moneySign,
    products,
  }: Request): Promise<Fair> {
    const fairRepository = getCustomRepository(FairRepository);

    const fair = fairRepository.create({
      name,
      zipcode,
      address,
      score,
      opening,
      closing,
      weekDay,
      deliveryPrice,
      moneySign,
    });

    await fairRepository.save(fair);
    return fair;
  }
}

export default CreateFairService;
