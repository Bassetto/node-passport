module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'Por favor faça o login para ver este recurso')
            req.redirect('/users/login');
        }
    }
};