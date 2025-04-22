import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae token del header
  secretOrKey: process.env.JWT_SECRET, // Clave secreta para verificar
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, { id: user._id, role: user.role }); // Lo que irá en req.user
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);