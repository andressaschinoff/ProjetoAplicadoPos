import { Router, Request, Response, NextFunction, response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
// import Client from '../models/Client';
import fs from 'fs';
var path = require('path');
import User from '../models/User';

const routes = Router();
const keys = {
  private: path.resolve('jwtRS256.key'),
  public: path.resolve('jwtRS256.key.pub'),
};

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    // if (email && password && role) {
    // const resp = await findClientOrUser(role, email, password);
    const resp = await findClientOrUser(email, password);
    return resp.auth
      ? res.json({ token: resp.token })
      : res.status(401).json(resp.message);
  }

  return res.status(401).json({ message: 'Empty user' });
});

// async function findClientOrUser(role: string, email: string, password: string) {
async function findClientOrUser(email: string, password: string) {
  try {
    // let finded: User | Client | undefined;

    // if (role === 'buyer') {
    //   finded = await getRepository(Client)
    //     .createQueryBuilder('client')
    //     .where('client.email = :email', { email: email })
    //     .addSelect('client.password')
    //     .getOne();
    // } else {
    const finded = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();
    // }

    if (!!finded) {
      const pwdMatches = bcrypt.compareSync(password, finded.password);

      const privateKey = fs.readFileSync(keys.private, 'utf-8');

      if (pwdMatches) {
        var token = sign({ ...finded }, privateKey, {
          expiresIn: 300,
          algorithm: 'RS256',
        });

        return { auth: true, token: token };
      }
      return { auth: false, message: 'Incorrect password' };
    }
    return { auth: false, message: 'Invalid user' };
  } catch (err) {
    console.log(err);
    return { auth: false, message: err };
  }
}

routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

export { routes as loginRoute };
