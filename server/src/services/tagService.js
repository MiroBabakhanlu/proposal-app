const tagRepository = require('../repositories/tagRepository');

const tagService = {
  getAllTags: async () => {
    return tagRepository.getAllTags();
  },

  createTag: async (name) => {
    if (!name || typeof name !== 'string') {
      throw new Error('Tag name is required');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Tag name cannot be empty');
    }

    const tag = await tagRepository.getOrCreateTag(trimmedName);
    return tag;
  }
};

module.exports = tagService;