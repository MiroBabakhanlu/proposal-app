const prisma = require('../utils/prisma');

const userRepository = {
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  create: (userData) => prisma.user.create({ data: userData }),
  findById: (id) => prisma.user.findUnique({ 
    where: { id },
    select: { 
      id: true, 
      email: true, 
      name: true, 
      role: true 
    } 
  })
};

module.exports = userRepository;