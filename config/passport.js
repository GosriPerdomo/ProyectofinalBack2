const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const secretKey = process.env.JWT_SECRET_KEY || 'tareacoder';

// Opciones para la estrategia JWT
const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
  secretOrKey: secretKey,
};

// Función para extraer el JWT de las cookies
function extractJwtFromCookie(req) {
  return req.cookies && req.cookies.jwt ? req.cookies.jwt : null;
}

// Estrategia JWT
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        console.log('Usuario autenticado:', user);
        return done(null, user);
      } else {
        console.log('Usuario no encontrado, token inválido.');
        return done(null, false);
      }
    } catch (err) {
      console.error('Error al buscar el usuario:', err);
      return done(err, false);
    }
  })
);

module.exports = passport;




