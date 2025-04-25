import passport from 'passport';
import { Strategy as JwtStrategy} from 'passport-jwt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const cookieExtractor = (req)=>{
  let token = null
  if (req && req.cookies){
    token = req.cookies.jwt
  }
  return token
}

const opts = {
  jwtFromRequest: cookieExtractor, 
  secretOrKey: process.env.JWT_SECRET, 
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, { id: user._id, email:user.email }); 
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);