const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const recentUploads = [];

exports.postUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    recentUploads.push(imageUrl);  // Save the image URL in our in-memory array
    res.json({ imageUrl: imageUrl });
};

exports.getUpload = (req, res) => {
    try {
        const lastUpload = recentUploads[recentUploads.length - 1];
        if (lastUpload) {
            res.json({ imageUrl: lastUpload });
        } else {
            res.status(404).send("Sem imagens ainda.");
        }
    } catch (e) {
        res.status(500).send("Erro interno do servidor.");
    }
};
