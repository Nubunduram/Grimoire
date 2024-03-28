const Book = require("../models/Book");
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    book.save()
        .then(() => { res.status(201).json({ message: 'Objet Enregistré' }) })
        .catch((error) => { res.status(400).json({ error }) })
};

exports.modifyBook = (req, res, next) => {
    // Extract book data from request body
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Remove _userId field from update object
    delete bookObject._userId;
    // Find the book by ID
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Check if the current user is authorized to modify the book
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            // If a new image is provided, delete the old image
            if (req.file && book.imageUrl) {
                const imagePath = path.join(__dirname, '..', 'images', book.imageUrl.split('/images/')[1]);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image file:", err);
                    }
                });
            }
            // Update the book with the new data
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Book modified successfully' }))
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => {
            console.error("Error finding book:", error);
            res.status(500).json({ error: "Error finding book" });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Unauthorized request" })
            } else {
                const filename = book.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "Livre Supprimé" }) })
                        .catch((error) => { res.status(401).json({ error }) })
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// exports.getBestRating = (req, res, next) => {

// }

// exports.rateBook = (req, res, next) => {

// }