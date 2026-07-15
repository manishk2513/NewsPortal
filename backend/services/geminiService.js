const axios = require("axios");

function getGeminiModels() {
  return [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
  ].filter(Boolean);
}

function getGeminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
}

async function callGemini(prompt) {
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  for (const model of getGeminiModels()) {
    try {
      const response = await axios.post(getGeminiUrl(model), payload);
      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
      const status = error.response?.status;
      const details = error.response?.data?.error?.message || error.message;
      console.error(
        `Gemini API error (${model}${status ? ` ${status}` : ""}):`,
        details,
      );

      if (status !== 404) {
        return null;
      }
    }
  }

  return null;
}

async function rewriteArticle(title, content) {
  const prompt = `
You are a professional news journalist.
Rewrite the following news article.
Rules:
- Keep all facts accurate
- Make it engaging and professional
- Write in clear neutral journalistic tone
- Do not add opinions
- Length should be 200 to 300 words
- Return ONLY the rewritten article text nothing else

Title: ${title}
Content: ${content}
`;
  return await callGemini(prompt);
}

async function generateSummary(content) {
  const prompt = `
Summarize this news article in not more than 18 sentences.
Return ONLY the summary nothing else.

Article: ${content}
`;
  return await callGemini(prompt);
}

async function translateArticle(title, content, summary, targetLanguage) {
  const languageNames = {
    hi: "Hindi",
    mr: "Marathi",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
    gu: "Gujarati",
    kn: "Kannada",
    pa: "Punjabi",
    fr: "French",
    es: "Spanish",
    de: "German",
    ar: "Arabic",
  };

  const langName = languageNames[targetLanguage] || targetLanguage;

  const prompt = `
You are a professional translator and journalist.
Translate the following news article into ${langName}.
Rules:
- Use natural contextually accurate language
- Do NOT translate proper nouns like names of people places organizations
- Maintain journalistic tone
- Preserve the meaning not just dictionary words
- Return a JSON object with exactly these keys: title, content, summary
- Return ONLY the JSON no other text no markdown no backticks

Title: ${title}
Content: ${content}
Summary: ${summary}
`;

  const result = await callGemini(prompt);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Translation parse error:", e.message);
    return null;
  }
}

module.exports = { rewriteArticle, generateSummary, translateArticle };
