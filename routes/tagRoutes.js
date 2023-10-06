const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

router.post('/tag', tagController.postTag);
router.get('/tag', tagController.getTags);
router.get('/tag/:id', tagController.getTag);
router.delete('/tag/:id', tagController.deleteTag);

module.exports = router;