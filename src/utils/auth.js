const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cfg = require("../config.js");
const User = require('../models/User');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.jwtSecret
};

const strategy = new JwtStrategy(opts, async (payload, done) => {
    try {
        const user = await User.findOne({id: payload.sub});
        if (!user) {
            return done(null, false);
        } else {
            // user not found
            return done(null, user);
        }
    } catch (err) {
        return done(err, false);
    }
});

module.exports = (passport) => {
    passport.use(strategy);
};


