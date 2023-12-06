const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();
/**
 * @swagger
 * /tag:
 *   post:
 *     summary: Retorna o registro de uma tag (no caso, uma palavra ou descrição breve sobre características do item de filme e / ou interesses do usuário em relação ao filme).
 *     responses:
 *       200:
 *         description: Cadastro de tag bem sucedido
 */
router.post('/tag', tagController.postTag);
/**
 * @swagger
 * /tag:
 *   get:
 *     summary: Retorna uma lista de todas as tags registradas.
 *     responses:
 *       200:
 *         description: Listagem de tags bem sucedida
 */
router.get('/tag', tagController.getTags);
/**
 * @swagger
 * /tag/:id:
 *   get:
 *     summary: Retorna uma tag de acordo com seu identificador numérico.
 *     responses:
 *       200:
 *         description: Busca de tag bem sucedida
 */
router.get('/tag/:id', tagController.getTag);
/**
 * @swagger
 * /tag/:id:
 *   delete:
 *     summary: Deleta uma tag de acordo com seu identificador numérico.
 *     responses:
 *       200:
 *         description: Exclusão de tag bem sucedida
 */
router.delete('/tag/:id', tagController.deleteTag);

module.exports = router;