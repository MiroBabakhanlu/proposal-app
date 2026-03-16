const prisma = require('../utils/prisma');

const refreshTokenRepository = {
  create: async (userId, token, expiresAt) => {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  },

  findByToken: async (token) => {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });
  },

  delete: async (token) => {
    return prisma.refreshToken.delete({
      where: { token }
    });
  },

  deleteAllForUser: async (userId) => {
    return prisma.refreshToken.deleteMany({
      where: { userId }
    });
  },

  deleteExpired: async () => {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  }
};

module.exports = refreshTokenRepository;