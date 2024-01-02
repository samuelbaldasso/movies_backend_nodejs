const knex = require('knex');
const knexInstance = knex(require('../knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

exports.postFilm = async (req, res) => {
    const { title, description, nota, users_id } = req.body;

    try {
        await knexInstance('films').insert({
            title,
            description,
            nota,
            users_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        res.status(201).send({ message: "Filme adicionado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao adicionar filme", error });
    }
};

exports.putFilm = async (req, res) => {
    const { id } = req.params;
    const { title, description, nota } = req.body;

    try {
        const film = await knexInstance('films').where({ id }).first();

        if (!film) {
            return res.status(404).send({ message: "Filme não encontrado." });
        }

        await knexInstance('films')
            .where({ id })
            .update({
                title: title || film.title,
                description: description || film.description,
                nota: nota || film.nota
            });

        return res.status(200).send({ message: "Filme atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao alterar filme." });
    }
};

exports.getFilms = async (req, res) => {
    try {
        const films = await knexInstance('films').select();
        res.status(200).send(films);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter filmes", error });
    }
};

// Rota para obter um filme específico pelo ID
exports.getFilm = async (req, res) => {
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
};

exports.deleteFilm = async (req, res) => {
    const { id } = req.params;

    try {
        await knexInstance('films').where({ id }).delete();
        res.status(200).send({ message: "Filme excluído com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao excluir filme", error });
    }
};