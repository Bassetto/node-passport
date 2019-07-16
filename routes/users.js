const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //checando os campos
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Por favor preencha todos os campos.' });
    }

    //Checando se as senhas são iguais
    if (password !== password2) {
        errors.push({ msg: "As senhas não são iguais!" });
    }

    //checando o tamanho da senha
    if (password.length < 8) {
        errors.push({ msg: "A senha deve ter pelo menos 8 caracteres!" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Ta validado
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //Usuário existe
                    errors.push({ msg: 'O email ja está registrado!' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Criptografando a senha
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Agora você está registrado e pode se logar!');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err))
                        }))
                }
            })
            .catch();
    }
});

//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Você está desconectado');
    res.redirect('/users/login');
})

module.exports = router;