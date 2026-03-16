const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth/authMiddleware');
const { apiLimiter, proposalLimiter } = require('../middleware/rateLimiter');
const {
    getProposalReviews,
    submitReview,
    deleteReview,
    getMyReviews
} = require('../controllers/reviewController');


const { validateReview, checkValidation } = require('../middleware/validation');
const router = express.Router(); 

router.use(authMiddleware);

router.get('/my-reviews', apiLimiter, getMyReviews);

router.get('/:proposalId', apiLimiter, getProposalReviews);
router.post('/:proposalId', proposalLimiter, roleMiddleware(['REVIEWER', 'ADMIN']), validateReview, checkValidation, submitReview);
router.delete('/:id', proposalLimiter, roleMiddleware(['ADMIN']), deleteReview);

module.exports = router;