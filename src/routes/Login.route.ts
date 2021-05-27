import { Router, Request, Response, NextFunction, response } from 'express';
import { decode, sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import fs from 'fs';
var path = require('path');
import User from '../models/User';

const routes = Router();
const keys = {
  private: path.resolve('jwtRS256.key'),
  public: path.resolve('jwtRS256.key.pub'),
};

const privateKey = fs.readFileSync(keys.private, 'utf-8');

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const resp = await findUser(email, password);
    return resp.auth
      ? res.json({ token: resp.token })
      : res.status(401).json(resp.message);
  }

  return res.status(401).json({ message: 'Empty user' });
});

async function findUser(email: string, password: string) {
  try {
    const finded = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();

    if (!!finded) {
      const pwdMatches = bcrypt.compareSync(password, finded.password);

      if (pwdMatches) {
        const { password, ...user } = finded;
        var token = sign({ ...user }, privateKey, {
          expiresIn: '1d',
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

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);

    verify(onlyToken, privateKey, (err, decode) => {
      if (err) {
        return res.json({ error: err.message });
      }
      req.user = decode;
      next();
      return;
    });
  }

  return res.status(401).send({ error: 'Token is not supplied.' });
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user) {
    // if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ error: 'Admin Token is not valid.' });
};

routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

export { routes as loginRoute };
