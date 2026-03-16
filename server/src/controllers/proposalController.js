const proposalService = require('../services/proposalService');

const getProposals = async (req, res) => {
  try {
    const { tag, search, status, page = 1, limit = 5 } = req.query;
    const user = req.user;

    let result;

    if (user.role === 'SPEAKER') {
      // Speakers see only their own proposals
      result = await proposalService.getSpeakerProposals(user.id, { page, limit });
    } else {
      // Reviewers and admins see all (with filters)
      result = await proposalService.getAllProposals(
        { tag, search, status },
        user.role,
        { page, limit }
      );
    }

    res.json(result);
  } catch (error) {
    if (error.message === 'Access denied') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search,
      tag,
      status
    } = req.query;
    const result = await proposalService.getSpeakerProposals(req.user.id,
      { page, limit, search, tag, status }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.getProposalById(
      id,
      req.user.id,
      req.user.role
    );
    res.json(proposal);
  } catch (error) {
    if (error.message === 'Proposal not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const createProposal = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;
    const proposal = await proposalService.createProposal(
      req.body,
      req.user.id,
      filePath
    );

    const io = req.app.get('io');
    io.to('role:REVIEWER').to('role:ADMIN').emit('proposal:created', {
      proposalId: proposal.id,
      title: proposal.title,
      speakerName: req.user.name,
      message: `New proposal: "${proposal.title}"`
    });

    console.log('Emitting proposal:created to reviewers/admins', {
      proposalId: proposal.id,
      title: proposal.title
    });

    res.status(201).json(proposal);
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const proposal = await proposalService.updateProposalStatus(
      id,
      status,
      req.user.id
    );

    const io = req.app.get('io');
    io.to(`user:${proposal.speakerId}`).emit('proposal:statusChanged', {
      proposalId: proposal.id,
      title: proposal.title,
      newStatus: status,
      message: `Your proposal "${proposal.title}" is now ${status}`
    });

    io.to('role:REVIEWER').emit('data:stale', {
      type: 'proposals',
      message: 'Proposal status updated'
    });

    console.log('Emitting proposal:statusChanged to user:', proposal.speakerId);

    res.json(proposal);
  } catch (error) {
    if (error.message === 'Invalid status') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProposals,
  getMyProposals,
  getProposalById,
  createProposal,
  updateProposalStatus
};