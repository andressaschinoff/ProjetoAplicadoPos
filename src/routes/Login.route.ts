import { Router } from 'express';
import { auth } from '../functions/Auth';
import { responseLog } from '../functions/Logs';

const routes = Router();

routes.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      const err = new Error('Email or password not provided!');
      responseLog(err);
      return res.status(400).json({ error: err.message });
    }
    const { success, error, token } = await auth(email, password);
    if (!success || !token) {
      responseLog(error);
      return res.status(401).json({ error });
    }

    responseLog();
    return res.json({ token }).writeHead(200, {
      'Set-Cookie': `token=${token}; HttpOnly`,
      'Access-Control-Allow-Credentials': 'true',
    });
  } catch (error) {
    responseLog(error);
    return res.status(40).json({ error: error.message });
  }
});

routes.get('/logout', function (req, res) {
  req.logout();
  res
    .writeHead(200, {
      'Set-Cookie': '',
      'Access-Control-Allow-Credentials': 'true',
    })
    .send();
  res.redirect('/');
});

export { routes as loginRoute };
function authenticate(
  email: any,
  password: any,
):
  | { auth: any; error: any; token: any }
  | PromiseLike<{ auth: any; error: any; token: any }> {
  throw new Error('Function not implemented.');
}
