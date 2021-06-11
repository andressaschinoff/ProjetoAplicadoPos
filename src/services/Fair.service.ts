import { getCustomRepository } from 'typeorm';
import { Type } from '../enum/Type';

import Fair from '../models/Fair';
import FairRepository from '../repositories/Fair.repository';

export interface FairRequest {
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
  }: FairRequest): Promise<Fair> {
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
  ): Promise<Fair | { error: string }> {
    const fairRepository = getCustomRepository(FairRepository);

    const currentFair = await fairRepository.findOne({ id });

    if (!currentFair) {
      const err = new Error(`Fair id ${id} not found!`);
      return { error: err.message };
    }

    const newScore = (currentFair.score + score) / currentFair.numberOfScores;
    await fairRepository.update(id, { ...currentFair, score: newScore });

    const fair = await fairRepository.findOne({ id });

    if (!fair) {
      const err = new Error(`Fair id ${id} not found!`);
      return { error: err.message };
    }

    return fair;
  }
}

export { CreateFairService, ScoreFairService };
