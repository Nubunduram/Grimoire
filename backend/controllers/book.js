const Book = require('../models/Book')
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.getTopRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(topRatedBooks => {
            res.status(200).json(topRatedBooks);
        })
        .catch(error => {
            res.status(500).json({ error: 'An error has occurred' });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    if (!req.file) {
        return res.status(400).json({ message: 'File missing' });
    } else {
        delete bookObject._id;
        delete bookObject._userId;

        if (bookObject.ratings[0].grade === 0) {
            bookObject.ratings = [];
        }

        const filename = req.file.filename;

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
        });

        book.save()
            .then(() => {
                res.status(201).json({ message: 'Book saved' });
            })
            .catch(error => {
                fs.unlinkSync(`images/${filename}`);
                res.status(400).json({ error });
            });
    }
};

exports.addBookRating = (req, res, next) => {
    Book.findOne({
        _id: req.params.id,
        "ratings.userId": req.body.userId
    })
        .then(existingRating => {
            if (existingRating) {
                return res.status(400).json({ message: 'User has already rated this book' });
            }

            if (!(req.body.rating >= 0) && !(req.body.rating <= 5) && (typeof req.body.rating === 'number')) {
                return res.status(500).json({ message: 'Grade is not between 0 and 5 included or is not a number' });
            }

            Book.findOne({ _id: req.params.id })
                .then(book => {
                    if (!book) {
                        return res.status(404).json({ message: 'Book not found' });
                    }

                    book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
                    return book.save();
                })
                .then(book => {
                    res.status(200).json(book);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: 'An error has occurred' });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'An error has occurred' });
        });
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` } : { ...req.body };
    delete bookObject._userId;

    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Unauthorized request' });
            }

            if (req.file) {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
            }

            return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
        })
        .then(() => {
            res.status(200).json({ message: 'Book modified!' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    // Retrieves the book according to the id passed in the request
    Book.findOne({ _id: req.params.id })
        .then(book => {

            // Check if user is authorized to delete the book
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' })
            } else {

                // Delete file from the back end (images folder)
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {

                    // Delete the book from MongoDB
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Book deleted' }) })
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}