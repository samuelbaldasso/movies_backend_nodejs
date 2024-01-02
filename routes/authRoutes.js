const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Retorna a autenticação de um usuário já registrado via token JWT
 *     responses:
 *       200:
 *         description: Login bem sucedido
 */
router.post('/login', authController.login);

module.exports = router;
