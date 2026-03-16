const userService = require('../services/userService');

const register = async (req, res) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await userService.refreshToken(refreshToken);
        res.json(result);
    } catch (error) {
        if (error.message.includes('refresh token')) {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await userService.logout(refreshToken);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await userService.getMe(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe
};