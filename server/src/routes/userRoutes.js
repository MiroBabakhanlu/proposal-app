const express = require('express');
const { register, login, getMe, refreshToken, logout } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth/authMiddleware');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const {
    validateUser,
    validateLogin,  
    checkValidation
} = require('../middleware/validation');


const router = express.Router();

router.post('/register', authLimiter, validateUser, checkValidation, register);
router.post('/login', authLimiter, validateLogin, checkValidation, login);
router.get('/me', apiLimiter, authMiddleware, getMe);
router.post('/refresh-token', apiLimiter, refreshToken);
router.post('/logout', apiLimiter, logout);
module.exports = router;