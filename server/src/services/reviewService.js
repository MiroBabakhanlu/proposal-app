const reviewRepository = require('../repositories/reviewRepository');
const proposalRepository = require('../repositories/proposalRepository');

const reviewService = {
    getProposalReviews: async (proposalId, userId, userRole) => {
        const proposal = await proposalRepository.findById(proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }

        return reviewRepository.findByProposalId(proposalId);
    },

    // Create or update a review
    submitReview: async (proposalId, reviewerId, reviewData) => {
        const { rating, comment } = reviewData;

        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        const proposal = await proposalRepository.findById(proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }

        if (proposal.speakerId === reviewerId) {
            throw new Error('You cannot review your own proposal');
        }

        return reviewRepository.upsert(proposalId, reviewerId, {
            rating,
            comment: comment || null
        });
    },

    // Delete review (admin only)
    deleteReview: async (reviewId, adminId) => {
        return reviewRepository.delete(reviewId);
    },

    getReviewsByReviewer: async (reviewerId) => {
        const prisma = require('../utils/prisma');
        const reviews = await prisma.review.findMany({
            where: { reviewerId },
            include: {
                proposal: {
                    include: {
                        speaker: {
                            select: { id: true, name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return reviews;
    }
};

module.exports = reviewService;