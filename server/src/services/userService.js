const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

// i used seemingless login system by that  I mean,  when user registers it automatically logs in so it wont redirect to /register for login info I think it improves the ux

const userService = {
    register: async (userData) => {
        const { email, password, name, role } = userData;

        // if user exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'SPEAKER'
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // Save refresh token
        const expiresAt = new Date();
        const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || 7;
        expiresAt.setDate(expiresAt.getDate() + refreshExpiry);
        await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    },

    login: async (email, password) => {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // Save refresh token
        const expiresAt = new Date();
        const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || 7;
        expiresAt.setDate(expiresAt.getDate() + refreshExpiry);
        await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    },

    refreshToken: async (oldRefreshToken) => {
        const tokenRecord = await refreshTokenRepository.findByToken(oldRefreshToken);

        if (!tokenRecord) {
            throw new Error('Invalid refresh token');
        }

        if (tokenRecord.expiresAt < new Date()) {
            await refreshTokenRepository.delete(oldRefreshToken);
            throw new Error('Refresh token expired');
        }

        // Generate new access token
        const accessToken = generateAccessToken(tokenRecord.user);

        return { accessToken };
    },

    logout: async (refreshToken) => {
        if (refreshToken) {
            await refreshTokenRepository.delete(refreshToken);
        }
        return { message: 'Logged out successfully' };
    },

    getMe: async (userId) => {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};

module.exports = userService;


