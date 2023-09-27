const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexInstance = knex(require('./knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

const app = express();
app.use(bodyParser.json());
const bcrypt = require('bcrypt');

const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage });


const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);

const jwt = require('jsonwebtoken');

const cors = require('cors');
app.use(cors(
    {
        origin: 'http://localhost:3000',
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.use('/uploads', express.static('uploads'));
const recentUploads = [];
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Checa se o email já existe
    const existingUser = await knexInstance('users').where({ email }).first();
    if (existingUser) {
        return res.status(409).send({ message: "Email já cadastrado." });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await knexInstance('users').insert({
            name,
            email,
            password: hashedPassword
        });

        // Gera o token
        const token = jwt.sign({ userId: newUser.id, userEmail: newUser.email }, secret, { expiresIn: '1h' });
        res.status(201).send({ message: "Usuário registrado com sucesso!", token });
    } catch (error) {
        res.status(500).send({ message: "Erro ao registrar usuário", error });
    }
});

app.post('/user', async (req, res) => {
    const { name, email, password, avatar } = req.body;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: "E-mail inválido!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de salting

    try {
        await knexInstance('users').insert({
            name,
            email,
            password: hashedPassword,
            avatar,
            created_at: new Date(),
            updated_at: new Date()
        });
        res.status(201).send({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar usuário", error });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await knexInstance('users').where({ email }).first();
    if (!user) {
        return res.status(401).send({ message: "Email ou senha incorretos." });
    }

    // Compara a senha fornecida com a senha criptografada no banco de dados
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Email ou senha incorretos." });
    }

    // Gera o token
    const token = jwt.sign({ userId: user.id, userEmail: user.email }, secret, { expiresIn: '1h' });
    console.log(token)
    res.status(200).send({ message: "Login bem-sucedido!", token });
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ message: 'Acesso negado. Token inválido ou expirado!' });
        return;
    }
    next(err);
});

// Rota para adicionar filme
app.post('/film', async (req, res) => {
    const { title, description, nota, users_id } = req.body;

    try {
        await knexInstance('films').insert({
            title,
            description,
            nota,
            users_id,
            created_at: new Date(),
            updated_at: new Date()
        });
        res.status(201).send({ message: "Filme adicionado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao adicionar filme", error });
    }
});

// Rota para adicionar tag
app.post('/tag', async (req, res) => {
    const { name, film_id, users_id } = req.body;

    try {
        await knexInstance('tags').insert({
            name,
            film_id,
            users_id
        });
        res.status(201).send({ message: "Tag adicionada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao adicionar tag", error });
    }
});

// Rota para obter todos os usuários
app.get('/user', async (req, res) => {
    try {
        const users = await knexInstance('users').select();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter usuários", error });
    }
});

// Rota para obter um usuário específico pelo ID
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await knexInstance('users').where({ id }).first();
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ message: "Usuário não encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter usuário", error });
    }
});

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, actualPassword, password } = req.body;

    try {
        const user = await knexInstance('users').where({ id }).first();

        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        // If the user provided both the current and new passwords, handle the password update
        if (actualPassword && password) {
            const passwordMatch = await bcrypt.compare(actualPassword, user.password);

            if (!passwordMatch) {
                return res.status(400).send({ message: "Senha atual incorreta." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await knexInstance('users')
                .where({ id })
                .update({
                    password: hashedPassword,
                    name: name || user.name,
                    email: email || user.email,
                });

            return res.status(200).send({ message: "Usuário atualizado com sucesso!" });

        } else {
            // Handle updates without changing password
            await knexInstance('users')
                .where({ id })
                .update({
                    name: name || user.name,  // If name is provided, update it. Otherwise, keep the old value.
                    email: email || user.email,
                });

            return res.status(200).send({ message: "Usuário atualizado com sucesso!" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao alterar usuário." });
    }
});
app.post('/upload', upload.single('image'), (req, res) => {
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    recentUploads.push(imageUrl);  // Save the image URL in our in-memory array
    res.json({imageUrl: imageUrl});
});

app.get('/lastUpload', (req, res) => {
    // Get the most recent upload
    const lastUpload = recentUploads[recentUploads.length - 1];

    if (lastUpload) {
        res.json({imageUrl: lastUpload});
    } else {
        res.status(404).send("No images uploaded yet");
    }
});

// Rota para obter todos os filmes
app.get('/film', async (req, res) => {
    try {
        const films = await knexInstance('films').select();
        res.status(200).send(films);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter filmes", error });
    }
});

// Rota para obter um filme específico pelo ID
app.get('/film/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const film = await knexInstance('films').where({ id }).first();
        if (film) {
            res.status(200).send(film);
        } else {
            res.status(404).send({ message: "Filme não encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter filme", error });
    }
});

// Rota para obter todas as tags
app.get('/tag', async (req, res) => {
    try {
        const tags = await knexInstance('tags').select();
        res.status(200).send(tags);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter tags", error });
    }
});

// Rota para obter uma tag específica pelo ID
app.get('/tag/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tag = await knexInstance('tags').where({ id }).first();
        if (tag) {
            res.status(200).send(tag);
        } else {
            res.status(404).send({ message: "Tag não encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter tag", error });
    }
});

app.delete('/film/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knexInstance('films').where({ id }).delete();
        res.status(200).send({ message: "Filme excluído com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao excluir filme", error });
    }
});

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knexInstance('users').where({ id }).delete();
        res.status(200).send({ message: "Usuário excluído com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao excluir usuário", error });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
