const {Schema, model, Model} = require('mongoose');

const CompraSchema = new Schema({
    producto: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
})

module.exports = model('Compra', CompraSchema);
