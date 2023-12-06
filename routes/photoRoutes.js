const express = require('express');
const uploadPhotoController = require('../controllers/uploadPhotoController');

const router = express.Router();
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Retorna o upload de uma foto na pasta uploads do projeto. Desta forma, pode-se implementar um sistema de adição de foto de perfil para usuários.
 *     responses:
 *       200:
 *         description: Upload de imagem bem sucedido
 */
router.post('/upload', uploadPhotoController.postUpload);
/**
 * @swagger
 * /lastUpload:
 *   get:
 *     summary: Retorna a última foto registrada na lista de fotos da pasta uploads do projeto.
 *     responses:
 *       200:
 *         description: Busca de imagem bem sucedida
 */
router.get('/lastUpload', uploadPhotoController.getUpload);

module.exports = router;
