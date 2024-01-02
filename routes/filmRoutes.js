const express = require('express');
const filmController = require('../controllers/filmController');

const router = express.Router();

/**
 * @swagger
 * /film/film:
 *   post:
 *     summary: Retorna a criação de um novo item de filme
 *     responses:
 *       200:
 *         description: Cadastro de filme bem sucedido
 */
router.post('/film', filmController.postFilm);
/**
 * @swagger
 * /film/film:
 *   get:
 *     summary: Retorna a lista de todos os filmes já registrados
 *     responses:
 *       200:
 *         description: Listagem de filmes bem sucedida
 */
router.get('/film', filmController.getFilms);
/**
 * @swagger
 * /film/film/:id:
 *   get:
 *     summary: Retorna um filme pelo seu identificador numérico
 *     responses:
 *       200:
 *         description: Busca de filme bem sucedida
 */
router.get('/film/:id', filmController.getFilm);
/**
 * @swagger
 * /film/film/:id:
 *   delete:
 *     summary: Retorna a exclusão de um filme pelo seu identificador numérico
 *     responses:
 *       200:
 *         description: Exclusão de filme bem sucedida
 */
router.delete('/film/:id',filmController.deleteFilm);
/**
 * @swagger
 * /film/film/:id:
 *   put:
 *     summary: Retorna a atualização de um item de filme
 *     responses:
 *       200:
 *         description: Atualização de filme bem sucedido
 */
router.put('/film/:id', filmController.putFilm);

module.exports = router;
