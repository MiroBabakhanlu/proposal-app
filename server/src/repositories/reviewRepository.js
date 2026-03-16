const prisma = require('../utils/prisma');

const reviewRepository = {
  // Find all reviews for a proposal
  findByProposalId: (proposalId) => {
    return prisma.review.findMany({
      where: { proposalId },
      include: {
        reviewer: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Find review by proposal and reviewer
  findByProposalAndReviewer: (proposalId, reviewerId) => {
    return prisma.review.findUnique({
      where: {
        proposalId_reviewerId: {
          proposalId,
          reviewerId
        }
      }
    });
  },

  // Create or update review
  upsert: (proposalId, reviewerId, data) => {
    return prisma.review.upsert({
      where: {
        proposalId_reviewerId: {
          proposalId,
          reviewerId
        }
      },
      update: {
        rating: data.rating,
        comment: data.comment
      },
      create: {
        rating: data.rating,
        comment: data.comment,
        proposalId,
        reviewerId
      }
    });
  },


  delete: (id) => {
    return prisma.review.delete({
      where: { id }
    });
  }
};

module.exports = reviewRepository;