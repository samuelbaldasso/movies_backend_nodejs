const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
/**
 * @swagger
 * /user/user:
 *   post:
 *     summary: Ideal para administradores do sistema e para ambientes de desenvolvimento, esta API servirá para controle dos usuários no sistema, podendo-se cadastrar um usuário.
 *     responses:
 *       200:
 *         description: Cadastro de usuário bem sucedido
 */
router.post('/user', userController.postUser);
/**
 * @swagger
 * /user/user/:id:
 *   delete:
 *     summary: Ideal para administradores do sistema e para ambientes de desenvolvimento, esta API servirá para retornar a exclusão de um usuário.
 *     responses:
 *       200:
 *         description: Exclusão de usuário bem sucedido
 */
router.delete('/user/:id', userController.deleteUser);
/**
 * @swagger
 * /user/user/:id:
 *   put:
 *     summary: Retorna a atualização de dados de um usuário.
 *     responses:
 *       200:
 *         description: Atualização de usuário bem sucedido
 */
router.put('/user/:id', userController.putUser);
/**
 * @swagger
 * /user/user:
 *   get:
 *     summary: Retorna uma lista de todos os usuários.
 *     responses:
 *       200:
 *         description: Listagem de usuários bem sucedida
 */
router.get('/user', userController.getUsers);
/**
 * @swagger
 * /user/user/:id:
 *   get:
 *     summary: Retorna um usuário de acordo com seu identificador numérico.
 *     responses:
 *       200:
 *         description: Busca de usuário bem sucedida
 */
router.get('/user/:id', userController.getUser);

module.exports = router;
