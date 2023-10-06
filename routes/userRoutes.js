const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/user', userController.postUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.putUser);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUser);

module.exports = router;
