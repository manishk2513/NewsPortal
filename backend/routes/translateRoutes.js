const express = require('express');
const Article = require('../models/Article');
const { translateArticle } = require('../services/geminiService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { articleId, targetLanguage } = req.body;

  if (!articleId || !targetLanguage) {
    return res.status(400).json({ message: 'articleId and targetLanguage required' });
  }

  // English needs no translation — return content directly
  if (targetLanguage === 'en') {
    try {
      const article = await Article.findById(articleId);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      return res.json({ title: article.title, content: article.content, summary: article.summary });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Return cached translation if it already exists
    const cached = article.translations?.get(targetLanguage);
    if (cached) {
      return res.json(cached);
    }

    // Call Gemini to translate
    const translated = await translateArticle(
      article.title,
      article.content,
      article.summary,
      targetLanguage
    );

    if (!translated) {
      // Gemini failed — return original English content with a note
      return res.json({
        title: article.title,
        content: article.content,
        summary: article.summary,
        translationNote: 'Translation unavailable. Showing original English content.',
      });
    }

    // Cache the translation on the article document
    article.translations.set(targetLanguage, translated);
    await article.save();

    return res.json(translated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
