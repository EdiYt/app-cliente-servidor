const cloudinary = require('../config/cloudinaryConfig');
const booksDao = require('../dao/booksDao'); 

// Obtener todos los libros
async function getAllBooks(req, res) {
    try {
        const books = await booksDao.getAll();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los libros', error: err });
    }
}

// Obtener un libro por su ID
async function getBookById(req, res) {
    try {
        const id = req.params.id;
        const book = await booksDao.getById(id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el libro', error: err });
    }
}

// Controlador para registrar un libro
async function registerBook(req, res) {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No hay archivos para subir.');
        }
        
        const { nombre, autor, genero, estatus } = req.body;
        const pdfFile = req.files.pdf;

        // Sube el archivo PDF a Cloudinary
        const result = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
            resource_type: 'raw'
        });
        
        const pdfUrl = result.secure_url;

        const bookId = await insert({ nombre, autor, genero, estatus, pdf_url: pdfUrl });

        res.status(201).json({
            message: "Libro creado",
            bookId
        });
    } catch (error) {
        console.error('Error al registrar el libro:', error);
        res.status(500).json({
            error: 'Error al registrar el libro: ' + error.message
        });
    }
}


// Actualizar un libro
async function updateBook(req, res) {
    try {
        const id = req.params.id;
        const { nombre, autor, genero, estatus } = req.body; 
        const affectedRows = await booksDao.update(id, { nombre, autor, genero, estatus });
        if (affectedRows > 0) {
            res.json({ message: 'Libro actualizado' });
        } else {
            res.status(404).json({ message: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el libro', error: err });
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    registerBook,
    updateBook,
};
