const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connexion à MongoDB réussie !');
        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

// Set up CORS headers to allow request from all origins
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Use adapted routes for middlewares
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Allow multer middleware to access image directory storage
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;