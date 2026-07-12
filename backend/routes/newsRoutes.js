const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title summary imageUrl category source publishedAt translations');

    const total = await Article.countDocuments(filter);

    res.json({
      articles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
