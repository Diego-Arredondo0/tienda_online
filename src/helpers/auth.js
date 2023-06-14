const helpers = {};

helpers.isLogged = (req, res, next) => {
     if (req.isAuthenticated()) {
         return next();
     }
     req.flash('mensajeError', 'No está autorizado')
     res.redirect('/users/signin');
};

module.exports = helpers;