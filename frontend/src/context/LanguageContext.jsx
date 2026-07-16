import { useState, useCallback } from "react";
import { translateArticle } from "../api";
import { LanguageContext } from "./languageContextObject.js";

export { LanguageContext } from "./languageContextObject.js";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("newsLang") || "en",
  );

  // cache shape: { [articleId]: { [langCode]: { title, content, summary } } }
  const [translationCache, setTranslationCache] = useState({});

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem("newsLang", code);
  };

  // Returns translated content for an article.
  // Uses in-memory cache if available, otherwise calls the API and stores result.
  const getTranslation = useCallback(
    async (article, targetLanguage) => {
      if (!article?._id) return null;

      // English — return raw article fields, no API call needed
      if (targetLanguage === "en") {
        return {
          title: article.title,
          content: article.content,
          summary: article.summary,
        };
      }

      // Return from in-memory cache if already fetched this session
      const cached = translationCache[article._id]?.[targetLanguage];
      if (cached) return cached;

      // Also check translations embedded in the article object from the API
      // (MongoDB Map serialises as a plain object when the article is fetched)
      const fromArticle =
        article.translations?.[targetLanguage] ||
        article.translations?.get?.(targetLanguage);
      if (fromArticle) {
        setTranslationCache((prev) => ({
          ...prev,
          [article._id]: { ...(prev[article._id] || {}), [targetLanguage]: fromArticle },
        }));
        return fromArticle;
      }

      // Fetch from backend / Gemini
      try {
        const res = await translateArticle(article._id, targetLanguage);
        const data = res.data;
        setTranslationCache((prev) => ({
          ...prev,
          [article._id]: { ...(prev[article._id] || {}), [targetLanguage]: data },
        }));
        return data;
      } catch {
        return null;
      }
    },
    [translationCache],
  );

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, getTranslation, translationCache }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
