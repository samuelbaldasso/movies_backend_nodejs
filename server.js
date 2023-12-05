const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexInstance = knex(require('./knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

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

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors(
    {
        origin: 'https://gleaming-gecko-a150c9.netlify.app',
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

const upload = multer({ storage: storage });

const PORT = 3001;

const authRoutes = require('./routes/authRoutes');
const filmRoutes = require('./routes/filmRoutes');
const photoRoutes = require('./routes/photoRoutes');
const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');

app.use('/uploads', express.static("uploads"));

app.use('/auth', authRoutes);
app.use('/film', filmRoutes);
app.use(upload.single('image'), photoRoutes);
app.use('/user', userRoutes);
app.use('/tag', tagRoutes);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        if (err.message === "jwt expired") {
            return res.status(401).send('Token has expired');
        } else {
            return res.status(401).send('Unauthorized: ' + err.message);
        }
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
