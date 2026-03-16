const express = require('express');
const { authMiddleware } = require('../middleware/auth/authMiddleware');

const { getTags, createTag } = require('../controllers/tagController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTags);

router.post('/', createTag);

module.exports = router;