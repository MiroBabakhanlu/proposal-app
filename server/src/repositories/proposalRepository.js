const prisma = require('../utils/prisma');

const proposalRepository = {
  // Find all proposals with pagination
  findAllWithPagination: async (where = {}, pagination = {}) => {
    const { page = 1, limit = 5 } = pagination;
    const skip = (page - 1) * limit;

    const total = await prisma.proposal.count({ where });

    const data = await prisma.proposal.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        speaker: {
          select: { id: true, name: true, email: true }
        },
        tags: {
          include: {
            tag: true  // Include the actual tag data
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // this will transform the dtata  to match frontend expected format (array of tag names)
    const transformed = data.map(proposal => ({
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    }));

    return {
      data: transformed,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },

  // Find proposals by speaker ID with pagination
  findBySpeakerIdWithPagination: async (speakerId, { page = 1, limit = 5, search, tag, status }) => {
    const skip = (page - 1) * limit;
    const where = { speakerId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      };
    }

    if (status) {
      where.status = status;
    }

    const total = await prisma.proposal.count({ where });

    const data = await prisma.proposal.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // transform to tag names array
    const transformed = data.map(proposal => ({
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    }));

    return {
      data: transformed,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },

  // single proposal by ID
  findById: async (id) => {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        speaker: {
          select: { id: true, name: true, email: true }
        },
        tags: {
          include: {
            tag: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!proposal) return null;


    return {
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    };
  },

  // CREATE new proposal with tags
  create: async (data, tagIds) => {
    return prisma.proposal.create({
      data: {
        title: data.title,
        description: data.description,
        filePath: data.filePath,
        speakerId: data.speakerId,
        status: 'PENDING',
        tags: {
          create: tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    });
  },

  // Update proposal status
  updateStatus: async (id, status) => {
    return prisma.proposal.update({
      where: { id },
      data: { status },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    });
  },

  // kept this for backward compatibility meaning: (non-paginated)
  findAll: async (where = {}) => {
    const data = await prisma.proposal.findMany({
      where,
      include: {
        speaker: {
          select: { id: true, name: true, email: true }
        },
        tags: {
          include: { tag: true }
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return data.map(proposal => ({
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    }));
  },

  // For speaker proposals without pagination 
  findBySpeakerId: async (speakerId) => {
    const data = await prisma.proposal.findMany({
      where: { speakerId },
      include: {
        tags: {
          include: { tag: true }
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return data.map(proposal => ({
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    }));
  }
};

module.exports = proposalRepository;