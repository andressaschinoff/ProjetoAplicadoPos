import { getRepository } from 'typeorm';

import User from '../models/User';
import Fair from '../models/Fair';
import { genSalt, hash } from 'bcrypt';

interface RequestPost {
  name: string;
  cpf: string;
  email: string;
  password: string;
  telephone: string;
  fair?: Fair;
  address?: string;
  zipcode?: string;
  role: string;
}

class CreateUserService {
  public async execute({
    name,
    cpf,
    email,
    password,
    telephone,
    fair,
    role,
    address,
    zipcode,
  }: RequestPost): Promise<User> {
    const userRepository = getRepository(User);

    if (role === 'buyer' && (!address || !zipcode)) {
      throw new Error(`User role ${role} needs to send address info`);
    }

    const hashPassword = new Promise<string>((resolve, _reject) => {
      genSalt(10, (_err, salt) => {
        hash(password, salt, (_err, hash) => {
          resolve(hash);
        });
      });
    });

    const encriptedPass = await hashPassword;

    const user = userRepository.create({
      name,
      cpf,
      email,
      password: encriptedPass,
      telephone,
      fair,
      role,
      address,
      zipcode,
    });

    await userRepository.save(user);

    const customUser = await userRepository.findOne({ where: { id: user.id } });

    if (customUser === undefined) {
      throw new Error('Something went really wrong');
    }

    return customUser;
  }
}

export default CreateUserService;
