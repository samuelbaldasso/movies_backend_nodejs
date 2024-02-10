const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexInstance = knex(require('./knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors(
    {
        origin: 'http://localhost:3000',
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

const PORT = 3001;

const authRoutes = require('./routes/authRoutes');
const filmRoutes = require('./routes/filmRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/film', filmRoutes);
app.use('/user', userRoutes);

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
