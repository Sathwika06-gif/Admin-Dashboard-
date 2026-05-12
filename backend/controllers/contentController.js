const Content = require('../models/Content');

// GET /api/content
exports.getContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ updatedAt: -1 });
    res.json(contents);
  } catch (error) {
    console.error('Get Content Error:', error);
    res.status(500).json({
      message: 'Failed to load content',
      error: error.message
    });
  }
};

// POST /api/content
exports.createContent = async (req, res) => {
  try {
    const { title, body, status, tags } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Title is required'
      });
    }

    // Convert tags string to array if needed
    let parsedTags = [];

    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    // Create content
    const content = await Content.create({
      title: title.trim(),
      body: body || '',
      status: status || 'Draft',
      tags: parsedTags,
      updated: new Date().toISOString().slice(0, 10)
    });

    res.status(201).json(content);
  } catch (error) {
    console.error('Create Content Error:', error);
    res.status(500).json({
      message: 'Failed to create content',
      error: error.message
    });
  }
};

// PUT /api/content/:id
exports.updateContent = async (req, res) => {
  try {
    const { title, body, status, tags } = req.body;

    let parsedTags = [];

    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        status,
        tags: parsedTags,
        updated: new Date().toISOString().slice(0, 10)
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedContent) {
      return res.status(404).json({
        message: 'Content not found'
      });
    }

    res.json(updatedContent);
  } catch (error) {
    console.error('Update Content Error:', error);
    res.status(500).json({
      message: 'Failed to update content',
      error: error.message
    });
  }
};

// DELETE /api/content/:id
exports.deleteContent = async (req, res) => {
  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Content not found'
      });
    }

    res.json({
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete Content Error:', error);
    res.status(500).json({
      message: 'Failed to delete content',
      error: error.message
    });
  }
};