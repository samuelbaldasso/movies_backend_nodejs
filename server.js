const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexInstance = knex(require('./knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

const app = express();
app.use(bodyParser.json());
const bcrypt = require('bcrypt');

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

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


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
