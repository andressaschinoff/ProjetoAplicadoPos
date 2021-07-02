import { getCustomRepository } from 'typeorm';
import Fair from '../models/Fair';
import FairRepository from '../repositories/Fair.repository';
import { CreateFairService, FairRequest } from '../services/Fair.service';
import { responseLog } from './Logs';
import { update as updateUser, getOne as getUser } from './User';

async function getAll() {
  try {
    const fairRepository = getCustomRepository(FairRepository);

    const fairs = await fairRepository.find();

    responseLog(undefined, fairs);
    return { status: 200, fairs };
  } catch (err) {
    responseLog();
    return { status: 400, error: err.message };
  }
}

async function create(userId: string, body: FairRequest) {
  try {
    const { user } = await getUser(userId);

    if (!user) {
      const err = new Error('User not found!');
      responseLog(err);
      return { status: 404, error: err.message };
    }

    if (user?.role !== 'seller') {
      const err = new Error('User not allowed!');
      responseLog(err);
      return { status: 403, error: err.message };
    }
    const newFair = new CreateFairService();
    const fair = await newFair.execute({
      ...body,
    });

    responseLog(undefined, fair);
    return { status: 200, fair };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getOne(id: string) {
  try {
    const fairRepository = getCustomRepository(FairRepository);
    const fair = await fairRepository.findOne({ id });

    responseLog(undefined, fair);
    return { status: 200, fair };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function update(id: string, body: Partial<Fair> | Fair) {
  try {
    const fairRepository = getCustomRepository(FairRepository);

    await fairRepository.update(id, {
      ...body,
    });

    const updateFair = await fairRepository.findOne({ id });

    responseLog(undefined, updateFair);
    return { status: 200, fair: updateFair };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function remove(id: string) {
  try {
    const fairRepository = getCustomRepository(FairRepository);
    await fairRepository.delete(id);

    responseLog(undefined, { fair: `Fair ${id} deleted!` });
    return { status: 204 };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

export { getAll, create, getOne, update, remove };
