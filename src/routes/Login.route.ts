import { Router, Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import Client from '../models/Client';
import fs from 'fs';
import User from '../models/User';

const routes = Router();

function logRequest(request: Request, _response: Response, next: NextFunction) {
  const { method, originalUrl } = request;
  console.info(method + ': ' + originalUrl);
  return next();
}

routes.use(logRequest);

routes.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (req.body.username && req.body.password) {
    const resp = await findClientOrUser(role, username, password);
    return resp.auth
      ? res.json({ token: resp.token })
      : res.status(401).json(resp.message);
  }

  return res.status(401).json({ message: 'Empty user' });
});

async function findClientOrUser(
  role: string,
  username: string,
  password: string,
) {
  let finded: User | Client | undefined;

  if (role === 'client') {
    const Repository = getRepository(Client);
    finded = await Repository.findOne({
      where: { name: username, role: role },
    });
  } else {
    const Repository = getRepository(User);
    finded = await Repository.findOne({
      where: { name: username, role: role },
    });
  }

  if (!!finded) {
    const pwdMatches = bcrypt.compareSync(password, finded.password);

    var privateKey = fs.readFileSync('./private.key', 'utf-8');

    if (pwdMatches) {
      var token = sign({ role: finded.role }, privateKey, {
        expiresIn: 300,
        algorithm: 'RS256',
      });

      return { auth: true, token: token };
    }
    return { auth: false, message: 'Incorrect password' };
  }
  return { auth: false, message: 'Invalid user' };
}

routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

export { routes as loginRoute };
