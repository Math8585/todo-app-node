import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from './db.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

export default (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.error('Error in authenticateToken:', error);
        return done(error, false);
      }
    })
  );
};
