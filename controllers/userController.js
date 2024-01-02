const knex = require('knex');
const knexInstance = knex(require('../knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');
const bcrypt = require("bcrypt");
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

exports.postUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
      return res.status(400).send({ message: "Name, email, and password are required!" });
  }

  if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "E-mail inválido!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      const [userId] = await knexInstance('users').insert({
          name,
          email,
          password: hashedPassword,
          avatar,
          created_at: knexInstance.fn.now(),
          updated_at: knexInstance.fn.now(),
      }).returning('id');

      res.status(201).send({ message: "Usuário criado com sucesso!", userId });
  } catch (error) {
      if (error.code === '23505') {
          return res.status(400).send({ message: "E-mail já está em uso." });
      }
      res.status(500).send({ message: "Erro ao criar usuário", error });
  }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await knexInstance('users').select();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Erro ao obter usuários", error });
    }
};

// Rota para obter um usuário específico pelo ID
exports.getUser = async (req, res) => {
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
};

exports.putUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, actualPassword, password, avatar } = req.body;

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
                    avatar: avatar || user.avatar
                });

            return res.status(200).send({ message: "Usuário atualizado com sucesso!" });

        } else {
            // Handle updates without changing password
            await knexInstance('users')
                .where({ id })
                .update({
                    name: name || user.name,  
                    email: email || user.email,
                    avatar: avatar || user.avatar
                });

            return res.status(200).send({ message: "Usuário atualizado com sucesso!" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao alterar usuário." });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await knexInstance('users').where({ id }).delete();
        res.status(200).send({ message: "Usuário excluído com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao excluir usuário", error });
    }
};