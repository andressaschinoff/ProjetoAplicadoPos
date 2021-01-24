import { getRepository } from 'typeorm';

import User from '../models/User';
import Fair from '../models/Fair';

interface Request {
  name: string;
  cpf: string;
  email: string;
  password: string;
  telephone: string;
  fair: Fair;
}

class CreateUserService {
  public async execute({
    name,
    cpf,
    email,
    password,
    telephone,
    fair,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = userRepository.create({
      name,
      cpf,
      email,
      password,
      telephone,
      fair,
    });

    await userRepository.save(user);
    return user;
  }
}

export default CreateUserService;
