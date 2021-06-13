import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger.json';
import { googleConfig } from './configs/passportconfig';
import GooglePassport from 'passport-google-oauth20';
import BearerPassport from 'passport-http-bearer';
import router from './router';
import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use('/api', router);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
