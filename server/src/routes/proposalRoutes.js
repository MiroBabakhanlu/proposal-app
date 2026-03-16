const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth/authMiddleware');
const reviewRoutes = require('./reviewRoutes');
const upload = require('../middleware/upload');
const { apiLimiter, proposalLimiter } = require('../middleware/rateLimiter');
const {
  getProposals,
  getMyProposals,
  getProposalById,
  createProposal,
  updateProposalStatus
} = require('../controllers/proposalController');

const { validateProposal, validateStatus, checkValidation } = require('../middleware/validation');

const router = express.Router();


router.use(authMiddleware);
router.use(apiLimiter);


router.get('/my', getMyProposals);


router.get('/', getProposals);

// GET /api/proposals/:id
router.get('/:id', getProposalById);


router.post(
  '/',
  roleMiddleware(['SPEAKER', 'ADMIN']),
  proposalLimiter,
  upload.single('file'),
  validateProposal,
  checkValidation,
  createProposal
);




router.patch(
  '/:id/status',
  roleMiddleware(['ADMIN']),
  updateProposalStatus
);

module.exports = router;