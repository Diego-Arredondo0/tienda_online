const {Schema, model, Model} = require('mongoose');

const NoteSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: { 
        type: Number,
        required: true
    },
    imagenURL: {
        type : String,
        required : true
    }
}, {
    timestamps: true
})

module.exports = model('Note', NoteSchema);
