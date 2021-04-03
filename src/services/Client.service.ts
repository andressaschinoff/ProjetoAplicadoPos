import { genSalt, hash } from 'bcrypt';
import { getRepository } from 'typeorm';

import Client from '../models/Client';

interface Request {
  name: string;
  cpf: string;
  email: string;
  password: string;
  telephone: string;
}

class CreateClientService {
  public async execute({
    name,
    cpf,
    email,
    password,
    telephone,
  }: Request): Promise<Client> {
    const clientRepository = getRepository(Client);

    const hashPassword = new Promise<string>((resolve, _reject) => {
      genSalt(10, (_err, salt) => {
        hash(password, salt, (_err, hash) => {
          resolve(hash);
        });
      });
    });

    const encriptedPass = await hashPassword;

    const client = clientRepository.create({
      name,
      cpf,
      email,
      password: encriptedPass,
      telephone,
    });

    await clientRepository.save(client);

    const customClient = await clientRepository.findOne({
      where: { id: client.id },
    });

    if (customClient === undefined) {
      throw new Error('Something went really wrong');
    }

    return customClient;
  }
}

export default CreateClientService;
