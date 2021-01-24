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

    const client = clientRepository.create({
      name,
      cpf,
      email,
      password,
      telephone,
    });

    await clientRepository.save(client);
    return client;
  }
}

export default CreateClientService;
