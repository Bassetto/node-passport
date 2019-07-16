const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const bodyParser = require('body-parser');

const app = express();

//Passport config
require('./config/passport')(passport);

//Configuração DB

const db = require('./config/keys').MongoURI;

//Conexão com Mongo

mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB conectado :D'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Rotas
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use(express.static('views'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port: ${PORT}`));