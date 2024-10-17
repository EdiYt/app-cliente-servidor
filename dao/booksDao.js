const { booksDB } = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');


// Método que me da todos los libros
async function getAll() {
    const [rows] = await booksDB.query('SELECT * FROM libros');
    return rows;
}

// Método que me da un libro por id
async function getById(id) {
    const [rows] = await booksDB.query('SELECT * FROM libros WHERE id = ?', [id]);
    return rows[0];
}

// Método que me deja insertar un libro con URL del PDF
async function insert(book) {
    const { nombre, autor, genero, estatus, pdf_url } = book;  // Agregamos pdf_url
    const result = await booksDB.query(
        'INSERT INTO libros (nombre, autor, genero, estatus, pdf_url) VALUES (?, ?, ?, ?, ?)', 
        [nombre, autor, genero, estatus, pdf_url]  // Incluimos pdf_url en los valores
    );
    return result[0].insertId;
}

// Método que actualiza los datos de un libro
async function update(id, book) {
    const { nombre, autor, genero, estatus } = book; 
    const result = await booksDB.query(
        'UPDATE libros SET nombre = ?, autor = ?, genero = ?, estatus = ? WHERE id = ?', 
        [nombre, autor, genero, estatus, id]
    );
    return result[0].affectedRows;
}

module.exports = {
    getAll,
    getById,
    insert,
    update,
};
