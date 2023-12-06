const nodemon = require("nodemon");
const fs = require("fs-extra")
const { uploadImage, deleteImage } = require("../helpers/cloudinary")
const notesCtrl = {};
const { ObjectId } = require("mongodb")

const Note = require('../models/Note');
const User = require('../models/User');
const Compra = require("../models/Compra");
const Ingreso = require("../models/Ingreso");
// requires

const PDFDocument = require("pdfkit-table");



notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/newNote')
}

notesCtrl.createNewNote = async (req, res) => {
    const { titulo, descripcion, precio, inventario } = req.body;
    console.log(req.files)
    let imagenURL = "";

    if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath);
        console.log(result)
        await fs.remove(req.files.image.tempFilePath);
        imagenURL = result.secure_url;
    }
    const newNote = new Note({ titulo, descripcion, precio: parseInt(precio), inventario, imagenURL });
    await newNote.save();
    req.flash('mensajeExito', 'El producto se agrego correctamente');
    res.redirect('/notes');
}

notesCtrl.renderNotes = async (req, res) => {
    const user = req.user

    const notes = await Note.find({ usuario: req.user.id }).sort({ createdAt: 'desc' });
    res.render('notes/allNotes', { notes, user });
}

notesCtrl.renderEditForm = async (req, res) => {
    const notaEditar = await Note.findById(req.params.id);
    res.render('notes/editarNota', { notaEditar });
}

notesCtrl.updateNote = async (req, res) => {
    const { titulo, descripcion, precio, inventario } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { titulo, descripcion, precio, inventario });
    req.flash('mensajeExito', 'El producto se ha actualizado correctamente');
    res.redirect('/notes');
}

notesCtrl.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('mensajeExito', 'El Producto fue eliminado');
    res.redirect('/notes');
}

notesCtrl.buy = async (req, res) => {
    const notaEditar = await Note.findById(req.params.id);
    const { cantidad } = req.body
    const nuevaCompra = new Compra({ usuario: req.user.nombre, producto: notaEditar.titulo, cantidad })
    const nuevoInventario = notaEditar.inventario - cantidad
    await Note.findByIdAndUpdate(req.params.id, { inventario: nuevoInventario });
    await nuevaCompra.save()
    req.flash('mensajeExito', 'La compra fue exitosa');
    res.redirect('/notes');
}

notesCtrl.agregarInventario = async (req, res) => {
    const notaEditar = await Note.findById(req.params.id);
    const { cantidad } = req.body
    const nuevaIngreso = new Ingreso({ usuario: req.user.nombre, producto: notaEditar.titulo, cantidad })
    const nuevoInventario = notaEditar.inventario + parseInt(cantidad)
    await Note.findByIdAndUpdate(req.params.id, { inventario: nuevoInventario });
    await nuevaIngreso.save()
    req.flash('mensajeExito', 'Se ha añadido más cantidad de este elemento');
    res.redirect('/notes');
}

notesCtrl.agregarPDF = async (req, res) => {
    const compras = await Compra.find()
    const listaCompras =[]
    compras.forEach(compra => {
        const aux = []
        aux.push(compra.producto)
        aux.push(compra.cantidad)
        aux.push(compra.usuario)

        listaCompras.push(aux)
    });

    const ingresos = await Ingreso.find()
    const listaIngresos =[]
    ingresos.forEach(ingreso => {
        const aux = []
        aux.push(ingreso.producto)
        aux.push(ingreso.cantidad)
        aux.push(ingreso.usuario)

        listaIngresos.push(aux)
    });

    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.pipe(fs.createWriteStream("./document.pdf"));

    ; (async function createTable() {
        const table = {
            title: "Compras",
            headers: ["Producto", "Cantidad comprada", "Usuario que compro"],
            rows: listaCompras
        };
        await doc.table(table, { width: 300, });
        await doc.table(table, {
            columnsSize: [200, 100, 100],
        });
    })();

    ; (async function createTable() {
        const table = {
            title: "Ingresos",
            headers: ["Producto", "Cantidad ingresada", "Usuario que ingreso"],
            rows: listaIngresos
        };
        await doc.table(table, { width: 300, });
        await doc.table(table, {
            columnsSize: [200, 100, 100],
        });
    })();
    doc.pipe(res);
    doc.end();
}

notesCtrl.renderCompras = async (req, res) => {
    const compras = await Compra.find({usuario:req.user.nombre});
    console.log(compras)

    res.render('notes/todasCompras', { compras });
}



module.exports = notesCtrl;