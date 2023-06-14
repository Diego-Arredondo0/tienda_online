const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');


passport.use(new localStrategy({
    usernameField : 'email',
    passwordField : 'contraseña'
}, async (email, contraseña, terminado) => {
    const user = await User.findOne({email});
    if (!user) {
        return terminado(null, false, { message: 'No existe este usuario'});
    } else {
        const match = await user.matchPassword(contraseña);
        if (match) {
            return terminado(null, user)
        } else {
            return terminado(null, false, { message: 'Contraseña incorrecta' })
        }
    }
}));

passport.serializeUser((user, terminado) => {
    terminado(null, user.id);
});

passport.deserializeUser((id, terminado) => {
    User.findById(id, (err, user) => {
        terminado(err, user);
    })
});