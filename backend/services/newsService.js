const axios = require('axios');

function getKey() {
  return process.env.GNEWS_API_KEY;
}

async function fetchIndiaNews() {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        country: 'in',
        lang: 'en',
        max: 10,
        apikey: getKey()
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error('GNews India error:', error.response?.data || error.message);
    return [];
  }
}

async function fetchWorldNews() {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        topic: 'world',
        lang: 'en',
        max: 5,
        apikey: getKey()
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error('GNews World error:', error.response?.data || error.message);
    return [];
  }
}

async function fetchByCategory(category) {
  // GNews valid topic values — 'nation' is used for India-specific category news
  // NOTE: 'topic' and 'country' cannot be combined on the GNews API.
  // Use 'topic' alone for category-based fetches.
  const topicMap = {
    technology:    'technology',
    business:      'business',
    sports:        'sports',
    entertainment: 'entertainment',
    health:        'health',
    science:       'science',
    world:         'world',
    india:         'nation',
  };

  const topic = topicMap[category];

  // If no valid topic mapping exists, fall back to India general headlines
  if (!topic) {
    return fetchIndiaNews();
  }

  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        topic: topic,
        lang: 'en',
        max: 10,
        apikey: getKey()
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error(`GNews ${category} error:`, error.response?.data || error.message);
    return [];
  }
}

module.exports = { fetchIndiaNews, fetchWorldNews, fetchByCategory };
