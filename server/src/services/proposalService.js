const proposalRepository = require('../repositories/proposalRepository');
const tagRepository = require('../repositories/tagRepository');

const proposalService = {
  getAllProposals: async (filters = {}, userRole, pagination = {}) => {
    // reviewers and admins can see all proposals
    if (userRole !== 'REVIEWER' && userRole !== 'ADMIN') {
      throw new Error('Access denied');
    }

    const where = {};

    // apply filters
    if (filters.tag) {
      where.tags = {
        some: {
          tag: {
            name: filters.tag
          }
        }
      };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.status && userRole === 'ADMIN') {
      where.status = filters.status;
    }

    // Get paginated results
    return proposalRepository.findAllWithPagination(where, pagination);
  },

  // Get proposals for a specific speaker
  getSpeakerProposals: async (speakerId, { page, limit, search, tag, status }) => {
    return proposalRepository.findBySpeakerIdWithPagination(speakerId, { page, limit, search, tag, status });
  },

  // Get single proposal by ID
  getProposalById: async (id, userId, userRole) => {
    const proposal = await proposalRepository.findById(id);

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Check access: speakers can only see their own
    if (userRole === 'SPEAKER' && proposal.speakerId !== userId) {
      throw new Error('Access denied');
    }

    return proposal;
  },

  // Create new proposal
  createProposal: async (proposalData, speakerId, filePath) => {
    if (!proposalData.title || !proposalData.description) {
      throw new Error('Title and description are required');
    }

    // Parse tags if they came as JSON string
    let tags = proposalData.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [];
      }
    }

    //  create or get existing ones
    let tagIds = [];
    if (tags && tags.length > 0) {
      const createdTags = await tagRepository.createTags(tags);
      tagIds = createdTags.map(tag => tag.id);
    }

    // handling tag relations
    const proposal = await proposalRepository.create({
      title: proposalData.title,
      description: proposalData.description,
      filePath,
      speakerId
    }, tagIds);

    // this will transform the data to match expected format in front (array of tag names)
    return {
      ...proposal,
      tags: proposal.tags.map(pt => pt.tag.name)
    };
  },

  // Update status ( only admin can use this)
  updateProposalStatus: async (id, status, adminId) => {
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const updated = await proposalRepository.updateStatus(id, status);

    // again , this will transform the data to match expected format in front 
    return {
      ...updated,
      tags: updated.tags.map(pt => pt.tag.name)
    };
  }
};

module.exports = proposalService;