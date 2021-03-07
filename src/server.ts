import 'reflect-metadata';
import express from 'express';
import passport from 'passport';
import { googleConfig } from './configs/passportconfig';
import { productRoute } from './routes/Product.route';
import { fairRoute } from './routes/Fair.route';
import { typeRoute } from './routes/Type.route';
import { userRoute } from './routes/User.route';
import { trollerRoute } from './routes/Troller.route';
import { clientRoute } from './routes/Client.route';
import { loginRoute } from './routes/Login.route';
import GooglePassport from 'passport-google-oauth20';
import BearerPassport from 'passport-http-bearer';
import './database';

const app = express();

app.use(express.json());

const GoogleStrategy = GooglePassport.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.CLIENTE_ID,
      clientSecret: googleConfig.CLIENT_SECRET,
      callbackURL: googleConfig.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(undefined, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

app.use('/login', loginRoute);
app.use('/product', productRoute);
app.use('/fair', fairRoute);
app.use('/type', typeRoute);
app.use('/user', userRoute);
app.use('/client', clientRoute);
app.use('/troller', trollerRoute);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
