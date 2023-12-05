const {Schema, model, Model} = require('mongoose');

const IngresoSchema = new Schema({
    producto: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    cantidad:{
        type: Number,
        required: false
    }
    
}, {
    timestamps: true
})

module.exports = model('Ingreso', IngresoSchema);
