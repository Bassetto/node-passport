const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Carregar o modelo de usuario
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passwordField: 'passwd'}, (email, password, done) => {
            //Validar o usuario
            user.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Esse e-mail não está registrado!' });
                }

                //Validar a senha
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        done(null, false, { message: "Senha incorreta!"});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => {
            done(err, user);
        });
    });
};