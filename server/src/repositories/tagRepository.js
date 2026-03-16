const prisma = require('../utils/prisma');

const tagRepository = {
  // Get all tags
  getAllTags: async () => {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
  },

  // Get or create tag by name
  getOrCreateTag: async (name) => {
    const trimmedName = name.trim();
    
    return prisma.tag.upsert({
      where: { name: trimmedName },
      update: {},
      create: { name: trimmedName }
    });
  },

  // Create multiple tags at once
  createTags: async (tagNames) => {
    // this will filter  out empty/duplicate names
    const uniqueNames = [...new Set(tagNames.map(n => n.trim()).filter(Boolean))];
    
    const results = await Promise.all(
      uniqueNames.map(name => 
        prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name }
        })
      )
    );
    
    return results;
  },

  findTagsByNames: async (names) => {
    return prisma.tag.findMany({
      where: {
        name: { in: names }
      }
    });
  },

  getPopularTags: async (limit = 10) => {
    return prisma.tag.findMany({
      take: limit,
      include: {
        _count: {
          select: { proposals: true }
        }
      },
      orderBy: {
        proposals: {
          _count: 'desc'
        }
      }
    });
  }
};

module.exports = tagRepository;