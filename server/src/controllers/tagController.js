const tagService = require('../services/tagService');

const getTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await tagService.createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('empty')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTags, createTag };