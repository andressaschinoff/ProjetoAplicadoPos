import { genSalt, hash } from 'bcrypt';
import { getRepository } from 'typeorm';
import User from '../models/User';
import CreateUserService, { UserRequest } from '../services/User.service';
import { responseLog } from './Logs';

async function getAll() {
  try {
    const userRepository = getRepository(User);

    const users = await userRepository.find();

    responseLog(undefined, users);
    return { status: 200, users };
  } catch (err) {
    responseLog();
    return { status: 400, error: err.message };
  }
}

async function create(data: UserRequest) {
  try {
    const userService = new CreateUserService();
    const newUser = await userService.execute({
      ...data,
    });

    responseLog(undefined, newUser);
    return { status: 200, user: newUser };
  } catch (err) {
    responseLog();
    return { status: 410, error: err.message };
  }
}

async function getOne(id: string) {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id });

    if (!user) {
      const err = new Error(`User id ${id} not found!`);
      responseLog(err);
      return { status: 404, error: err.message };
    }

    responseLog(undefined, user);
    return { status: 200, user };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function update(id: string, body: Partial<User> | User) {
  try {
    const { password, ...data } = body;

    const userRepository = getRepository(User);

    const hashPassword = !!password
      ? new Promise<string>((resolve, _reject) => {
          genSalt(10, (_err, salt) => {
            hash(password, salt, (_err, hash) => {
              resolve(hash);
            });
          });
        })
      : undefined;
    if (!hashPassword) {
      await userRepository.update(id, { ...data });
    } else {
      const encriptedPass = await hashPassword;
      await userRepository.update(id, {
        ...data,
        password: encriptedPass,
      });
    }

    const user = await userRepository.findOne({ id });

    responseLog(undefined, user);
    return { status: 200, user };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function remove(id: string) {
  try {
    const userRepository = getRepository(User);
    await userRepository.delete(id);

    responseLog(undefined, { user: `User ${id} deleted` });
    return { status: 204 };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getByEmailWithPass(email: string) {
  try {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      const err = new Error(`User not found by email ${email}!`);
      responseLog(err);
      return { status: 404, error: err.message };
    }

    responseLog(undefined, { user: { id: user.id } });
    return { status: 200, user };
  } catch (error) {
    responseLog(error);
    return { status: 400, error: error.message };
  }
}

async function getByFair(fairId: string) {
  try {
    const repository = getRepository(User);

    // const troller = await trollerRepository
    //   .createQueryBuilder('troller')
    //   .leftJoinAndSelect('troller.user', 'user')
    const seller = await repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.fair', 'fair')
      .where('fair.id = :id', { id: fairId })
      .getOne();

    if (!seller) {
      const err = new Error(`Users not found by fair id: ${fairId}!`);
      responseLog(err);
      return { status: 404, error: err.message };
    }

    responseLog(undefined, seller);
    return { status: 200, seller };
  } catch (error) {
    responseLog(error);
    return { status: 400, error: error.message };
  }
}

export {
  getAll,
  create,
  getOne,
  update,
  remove,
  getByEmailWithPass,
  getByFair,
};
