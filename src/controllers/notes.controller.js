const nodemon = require("nodemon");
const fs = require("fs-extra")
const {uploadImage, deleteImage} = require("../helpers/cloudinary")
const notesCtrl = {};
const {ObjectId} = require("mongodb")

const Note = require('../models/Note');
const User = require('../models/User');
const Compra = require("../models/Compra");
notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/newNote')
}

notesCtrl.createNewNote = async (req, res) => {
    const {titulo, descripcion, precio} = req.body;
    console.log(req.files)
    let imagenURL = "";

    if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath);
        console.log(result)
        await fs.remove(req.files.image.tempFilePath);
        imagenURL = result.secure_url;
    }
    const newNote = new Note({titulo, descripcion, precio: parseInt(precio), imagenURL});
    await newNote.save();
    req.flash('mensajeExito', 'El producto se agrego correctamente');
    res.redirect('/notes');
}

notesCtrl.renderNotes = async (req, res) => {
    const user = req.user

    const notes = await Note.find({usuario : req.user.id}).sort({createdAt : 'desc'});
    res.render('notes/allNotes', {notes, user});
}

notesCtrl.renderEditForm = async (req, res) => {
    const notaEditar = await Note.findById(req.params.id);
    res.render('notes/editarNota', {notaEditar});
}

notesCtrl.updateNote = async (req, res) => {
    const { titulo, descripcion, precio } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {titulo, descripcion, precio});
    req.flash('mensajeExito', 'El producto se ha actualizado correctamente');
    res.redirect('/notes');
}

notesCtrl.deleteNote =  async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('mensajeExito', 'El Producto fue eliminado');
    res.redirect('/notes');
}

notesCtrl.buy = async (req,res) => {
    const notaEditar = await Note.findById(req.params.id);
    const nuevaCompra = new Compra({usuario: req.user.nombre, producto: notaEditar.titulo })
    await nuevaCompra.save()   
    req.flash('mensajeExito', 'La compra fue exitosa');
    res.redirect('/notes');
}

notesCtrl.renderCompras = async (req, res) => {
    const compras = await Compra.find();
    console.log(compras)

    res.render('notes/todasCompras', {compras});
}



module.exports = notesCtrl;