const knex = require('knex');
const knexInstance = knex(require('../knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');
const bcrypt = require("bcrypt");

const secret = require('../config/secret');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await knexInstance('users').where({ email }).first();
    if (!user) {
        return res.status(401).send({ message: "Email ou senha incorretos." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Email ou senha incorretos." });
    }

    const token = jwt.sign({ userId: user.id, userEmail: user.email }, secret, { expiresIn: '1h' });
    console.log(token)
    res.status(200).send({ message: "Login bem-sucedido!", token });
};
