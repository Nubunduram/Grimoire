const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const bookCtrl = require("../controllers/book");

router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);

// router.get('/bestrating', bookCtrl.getBestRating);
// router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;