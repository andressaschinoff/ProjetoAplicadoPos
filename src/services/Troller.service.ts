import { getRepository } from 'typeorm';
import Troller from '../models/Troller';

interface CreateTrollerReturn {
  troller?: Troller;
  error?: string;
  success: boolean;
}

class CreateTrollerService {
  public async execute({
    user,
  }: Troller | Partial<Troller>): Promise<CreateTrollerReturn> {
    try {
      const trollerRepo = getRepository(Troller);
      const created = trollerRepo.create({
        active: true,
        user,
      });

      await trollerRepo.save(created);

      const troller = await trollerRepo.findOne({ id: created.id });

      if (!troller) {
        return { success: false, error: 'Error creating troller.' };
      }

      return { success: true, troller };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateTrollerService;
