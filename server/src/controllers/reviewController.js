const reviewService = require('../services/reviewService');
const proposalService = require('../services/proposalService');

const getProposalReviews = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const reviews = await reviewService.getProposalReviews(
            proposalId,
            req.user.id,
            req.user.role
        );
        res.json(reviews);
    } catch (error) {
        if (error.message === 'Proposal not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const submitReview = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const { rating, comment } = req.body;

        const review = await reviewService.submitReview(
            proposalId,
            req.user.id,
            { rating, comment }
        );

        const proposal = await proposalService.getProposalById(proposalId);
        const io = req.app.get('io');
        io.to(`user:${proposal.speakerId}`).emit('proposal:reviewed', {
            proposalId,
            reviewerName: req.user.name,
            rating,
            message: `Your proposal "${proposal.title}" received a review`
        });

        io.to('role:ADMIN').emit('data:stale', {
            type: 'reviews',
            message: 'New review submitted'
        });

        console.log('Emitting proposal:reviewed to user:', proposal.speakerId);

        res.status(201).json(review);
    } catch (error) {
        if (error.message.includes('must be between')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === 'Proposal not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'You cannot review your own proposal') {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await reviewService.deleteReview(id, req.user.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByReviewer(req.user.id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProposalReviews,
    submitReview,
    deleteReview,
    getMyReviews
};