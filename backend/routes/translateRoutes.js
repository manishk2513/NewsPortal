const express = require('express');
const Article = require('../models/Article');
const { translateArticle } = require('../services/geminiService');
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

    if (targetLanguage === 'en') {
      return res.json({
        title: article.title,
        content: article.content,
        summary: article.summary
      });
    }

    const cached = article.translations.get(targetLanguage);
    if (cached) {
      return res.json(cached);
    }

    const translated = await translateArticle(
      article.title,
      article.content,
      article.summary,
      targetLanguage
    );

    if (!translated) {
      return res.status(500).json({ message: 'Translation failed' });
    }

    article.translations.set(targetLanguage, translated);
    await article.save();

    res.json(translated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
