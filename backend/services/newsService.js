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
    console.error('GNews India error:', error.message);
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
    console.error('GNews World error:', error.message);
    return [];
  }
}

async function fetchByCategory(category) {
  const topicMap = {
    technology: 'technology',
    business: 'business',
    sports: 'sports',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science'
  };

  const topic = topicMap[category] || 'general';

  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        topic: topic,
        country: 'in',
        lang: 'en',
        max: 5,
        apikey: getKey()
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error(`GNews ${category} error:`, error.message);
    return [];
  }
}

module.exports = { fetchIndiaNews, fetchWorldNews, fetchByCategory };
