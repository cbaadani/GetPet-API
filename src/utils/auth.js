const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
    try {
        const user = await User.findOne({id: payload.sub});
        if (!user) {
            return done(null, null);
        } else {
            // user not found
            return done(null, user);
        }
    } catch (err) {
        return done(err, null);
    }
});

const authMiddleware = async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ error: info.message });
            }
            next();
        })(req, res, next);
    } catch (error) {
        return next(error)
    }
};

module.exports = {
    jwtStrategy,
    authMiddleware
};
