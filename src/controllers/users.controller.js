const usersCtrl = {};
const passport = require('passport');
const User = require('../models/User');

usersCtrl.renderFormRegistro = (req, res) => {
    res.render('users/registro');
};
usersCtrl.registro = async (req, res) => {
    const errors = [];
    const {nombre, email, contraseña, confirmarContraseña } = req.body;
    if (contraseña != confirmarContraseña) {
        errors.push({text: 'Las contraseñas no coiniciden'});
    };
    if (contraseña.length < 4) {
        errors.push({text: 'Las contraseñas tienen que tener al menos 4 caracteres'});
    };
    if (errors.length > 0 ) {
        res.render('users/registro', {
            errors,
            nombre,
            email
        });
        
    }else {
        const emailUser = await User.findOne({email:email});
        if (emailUser) {
            req.flash('mensajeError', "El correo ya está en uso");
            res.redirect('/users/signup')
        }else {
            const newUser = new User({nombre, email, contraseña, esAdmin:false});
            newUser.contraseña = await newUser.encryptPassword(contraseña);
            await newUser.save();
            req.flash('mensajeExito', 'Se ha registrado correctamente')
            res.redirect('/users/signin')
        }
    };
};

usersCtrl.renderFormInicioSesion = (req, res) => {
    res.render('users/inicio');
};
usersCtrl.inicioSesion = passport.authenticate('local', {
    failureRedirect : '/users/signin',
    successRedirect : '/notes',
    failureFlash : true
})

usersCtrl.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('mensajeExito', 'Has cerrado sesión')
    res.redirect('/users/signin')
};


module.exports = usersCtrl;