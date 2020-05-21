const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;
RememberMeStrategy = require('passport-remember-me-extended').Strategy;
const Chance = require('chance');

passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
    User
        .findOne({where: {Email: email}})
        .then(function (user) { // successful query to database
            if (!user) {
                return done(null, false, {message: 'Email is Not Registered'});
            } else {
                if (user.comparePass(password)) {
                    return done(null, user, {message: 'Logged In Successfully'});
                } else {
                    return done(null, false, {message: 'Wrong Password'});
                }
            }
        })
        .catch(function (err) { // something went wrong with query to db
            done(err);
        });
}));

// serialize session, only store user id in the session information
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// from the user id, figure out who the user is...
passport.deserializeUser(function (userId, done) {
    User
        .findOne({where: {id: userId}})
        .then(function (user) {
            done(null, user);
        }).catch(function (err) {
        done(err, null);
    });

});
passport.use(new RememberMeStrategy(
    function (token, done) {
        User
            .findOne({where: {RememberHash: token}})
            .then(function (user) {
                if (user) {
                    user.update({
                        RememberHash: null
                    }).then(result => {
                        return done(null, user);
                    });
                } else {
                    return done(null, false);
                }


            }).catch(function (err) {
            return done(err, null);
        });

    }, issueToken
));

function issueToken(user, done) {
    let chance = new Chance();
    let token = chance.word({length: 60});
    user.update({
        RememberHash: token
    }).then(result => {
        return done(null, token);
    }).catch(err => {
        return done(err);
    })
}

// chance.string({length: 60})