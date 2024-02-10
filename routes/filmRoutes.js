const express = require('express');
const filmController = require('../controllers/filmController');

const router = express.Router();

router.post('/film', filmController.postFilm);

router.get('/film', filmController.getFilms);

router.get('/film/:id', filmController.getFilm);

router.delete('/film/:id',filmController.deleteFilm);

router.put('/film/:id', filmController.putFilm);

module.exports = router;
