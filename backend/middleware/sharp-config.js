const sharp = require('sharp');
const fs = require('fs');

const resizeImage = async (req, res, next) => {
    if (req.file) {
        try {
            // Process image
            const newFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
            await sharp(req.file.path)
                .resize({ width: 405, height: 568 })
                .webp({ quality: 50 })
                .toFile(`images/${newFilename}`);

            // Delete the original image
            fs.unlinkSync(req.file.path);

            // add the new image
            req.file.path = `images/${newFilename}`;
            req.file.filename = newFilename;
            req.file.mimetype = "image/webp";
        } catch (error) {
            return res.status(500).json({ message: 'Failed to resize image', error });
        }
    }
    next();
};

module.exports = resizeImage;