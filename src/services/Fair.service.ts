import { getCustomRepository } from 'typeorm';
import { Type } from '../enum/Type';

import Fair from '../models/Fair';
import FairRepository from '../repositories/Fair.repository';

interface Request {
  name: string;
  zipcode: string;
  address: string;
  opening: string;
  closing: string;
  weekdays: string[];
  deliveryPrice: number;
  types: Type[];
}

class CreateFairService {
  public async execute({
    name,
    zipcode,
    address,
    opening,
    closing,
    weekdays,
    deliveryPrice,
    types,
  }: Request): Promise<Fair> {
    const fairRepository = getCustomRepository(FairRepository);

    const newWeekdays = weekdays.join('|');

    const fair = fairRepository.create({
      name,
      zipcode,
      address,
      opening,
      closing,
      weekdays: newWeekdays,
      deliveryPrice,
      types,
    });

    await fairRepository.save(fair);
    return fair;
  }
}

class ScoreFairService {
  public async execute(
    id: string,
    {
      score,
    }: {
      score: number;
    },
  ): Promise<Fair> {
    const fairRepository = getCustomRepository(FairRepository);

    const currentFair = (await fairRepository.findByIds([id]))[0];

    const newScore = (currentFair.score + score) / currentFair.numberOfScores;
    await fairRepository.update(id, { ...currentFair, score: newScore });

    const fair = (await fairRepository.findByIds([id]))[0];

    return fair;
  }
}

export { CreateFairService, ScoreFairService };
