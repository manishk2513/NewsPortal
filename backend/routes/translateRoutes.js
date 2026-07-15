const express = require('express');
const Article = require('../models/Article');
// Gemini disabled — translation returns a not-available response
// const { translateArticle } = require('../services/geminiService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { articleId, targetLanguage } = req.body;

  if (!articleId || !targetLanguage) {
    return res.status(400).json({ message: 'articleId and targetLanguage required' });
  }

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Always return English content while Gemini is disabled
    return res.json({
      title: article.title,
      content: article.content,
      summary: article.summary,
      translationNote: targetLanguage !== 'en'
        ? 'Translation service is currently disabled. Showing original English content.'
        : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
