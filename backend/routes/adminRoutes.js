const express = require("express");
const Article = require("../models/Article");
const {
  fetchIndiaNews,
  fetchWorldNews,
  fetchByCategory,
} = require("../services/newsService");
const {
  rewriteArticle,
  generateSummary,
} = require("../services/geminiService");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.use(authMiddleware);

router.post("/fetch", async (req, res) => {
  try {
    const { category = "india" } = req.body;
    let rawArticles = [];

    if (category === "india") {
      rawArticles = await fetchIndiaNews();
    } else if (category === "world") {
      rawArticles = await fetchWorldNews();
    } else {
      rawArticles = await fetchByCategory(category);
    }

    if (rawArticles.length === 0) {
      return res.json({ message: "No articles fetched", count: 0 });
    }

    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (const raw of rawArticles) {
      try {
        const exists = await Article.findOne({ originalTitle: raw.title });
        if (exists) continue;

        const fallbackContent = raw.description || raw.content || raw.title;
        const rewrittenContent =
          (await rewriteArticle(raw.title, fallbackContent)) || fallbackContent;

        const summary =
          (await generateSummary(rewrittenContent)) ||
          (raw.description ? raw.description.substring(0, 150) : "");

        const article = new Article({
          title: raw.title,
          originalTitle: raw.title,
          content: rewrittenContent,
          originalContent: raw.content || raw.description,
          summary,
          imageUrl: raw.image || "",
          source: {
            name: raw.source?.name || "Unknown",
            url: raw.url || "",
          },
          category: category,
          status: "draft",
          aiRewritten: true,
        });

        await article.save();
        results.push(article);
        successCount++;

        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (err) {
        console.error("Article error:", err.message);
        failCount++;
      }
    }

    res.json({
      message: "Done",
      success: successCount,
      failed: failCount,
      articles: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/drafts", async (req, res) => {
  try {
    const drafts = await Article.find({ status: "draft" }).sort({
      fetchedAt: -1,
    });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ fetchedAt: -1 })
      .select("title status category fetchedAt publishedAt aiRewritten");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const total = await Article.countDocuments();
    const published = await Article.countDocuments({ status: "published" });
    const drafts = await Article.countDocuments({ status: "draft" });
    const aiRewritten = await Article.countDocuments({ aiRewritten: true });
    res.json({ total, published, drafts, aiRewritten });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/publish/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { status: "published", publishedAt: new Date() },
      { new: true },
    );
    if (!article) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Published", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/unpublish/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { status: "draft" },
      { new: true },
    );
    res.json({ message: "Unpublished", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/articles/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
