const knex = require('knex');
const knexInstance = knex(require('../knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');
const bcrypt = require("bcrypt");

const secret = require('../config/secret');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
};
