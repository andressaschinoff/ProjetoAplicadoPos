import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { getByEmailWithPass } from './User';
import { responseLog } from './Logs';
import { sign, verify } from 'jsonwebtoken';
import User from '../models/User';

const keys = {
  private: path.resolve('jwtRS256.key'),
  public: path.resolve('jwtRS256.key.pub'),
};

export const privateKey = fs.readFileSync(keys.private, 'utf-8');

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({ error: 'User not loged!' });
  }

  const token = bearerHeader?.split(' ')[1];
  verify(token, privateKey, { algorithms: ['RS256'] }, (err, _decode) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.authInfo = { success: true };
    next();
  });
};

async function auth(email: string, password: string) {
  try {
    const { error, status, user: passUser } = await getByEmailWithPass(email);

    if (status !== 200 || !passUser) {
      responseLog(error);
      return { success: false, error };
    }
    const pwdMatches = bcrypt.compareSync(password, passUser.password);

    if (pwdMatches) {
      const { password, ...user } = passUser;
      var token = sign({ ...user }, privateKey, {
        expiresIn: '1d',
        algorithm: 'RS256',
      });

      return { success: true, token: token };
    }
    return { success: false, error: 'Incorrect password' };
  } catch (err) {
    responseLog(err);
    return { success: false, error: err };
  }
}

const getUserByToken = (req: Request, res: Response, next: NextFunction) => {
  // const bearerHeader = req.headers.authorization;
  const token = req.cookies.token;
  console.log(token);

  // if (!bearerHeader) {
  //   return res.status(401).json({ error: 'User not loged!' });
  // }
  if (!token) {
    return res.status(401).json({ error: 'User not loged!' });
  }

  // const token = bearerHeader?.split(' ')[1];
  verify(token, privateKey, { algorithms: ['RS256'] }, (err, decode) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.user = decode;
    next();
  });
};

const isSeller = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (!!user && user.role === 'seller') {
    return next();
  }
  return res.status(401).send({ error: 'User not authorized!' });
};

export { getUserByToken, isSeller, auth };
