import { getCustomRepository } from 'typeorm';
import { Type } from '../enum/Type';

import Fair from '../models/Fair';
import FairRepository from '../repositories/Fair.repository';

interface Request {
  name: string;
  zipcode: string;
  address: string;
  score: number;
  opening: string;
  closing: string;
  weekDay: string;
  deliveryPrice: number;
  moneySign: number;
  types: Type[];
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
    types,
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
      types,
    });

    await fairRepository.save(fair);
    return fair;
  }
}

export default CreateFairService;
