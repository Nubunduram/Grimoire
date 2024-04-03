const sharp = require('sharp');
const fs = require('fs').promises;

const resizeImage = (req, res, next) => {
    if (req.file) {
        // Process image
        const newFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");

        sharp(req.file.path)
            .resize({ width: 405, height: 568 })
            .webp({ quality: 50 })
            .toFile(`images/${newFilename}`)
            .then(() => {
                // Delete the original image
                return fs.unlink(req.file.path);
            })
            .then(() => {
                // Add the new image
                req.file.path = `images/${newFilename}`;
                req.file.filename = newFilename;
                req.file.mimetype = "image/webp";
                next();
            })
            .catch(error => {
                res.status(500).json({ message: 'Failed to resize image', error });
            });
    } else {
        next();
    }
};

module.exports = resizeImage;
