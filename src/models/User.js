const {Schema, model, Model} = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    contraseña: {type: String, required: true},
    esAdmin: {type:Boolean, required: true}
}, {
    timestamps: true
});

UserSchema.methods.encryptPassword = async contraseña => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contraseña, salt);
};

UserSchema.methods.matchPassword = async function(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
}


module.exports = model('User', UserSchema);