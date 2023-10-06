const knex = require('knex');
const knexInstance = knex(require('../knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

exports.postTag = async (req, res) => {
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
};

exports.getTags = async (req, res) => {
    try {
        const tags = await knexInstance('tags').select();
        res.status(200).send(tags);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter tags", error });
    }
};

// Rota para obter uma tag específica pelo ID
exports.getTag = async (req, res) => {
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
};

exports.deleteTag = async (req, res) => {
    const { id } = req.params;

    try {
        await knexInstance('tags').where({ id }).delete();
        res.status(200).send({ message: "Tag excluída com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao excluir tag", error });
    }
};
