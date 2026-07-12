const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  originalTitle: String,
  content: {
    type: String,
    required: true
  },
  originalContent: String,
  summary: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  source: {
    name: String,
    url: String
  },
  category: {
    type: String,
    default: 'general',
    enum: ['general', 'technology', 'business', 'sports',
           'entertainment', 'health', 'science', 'india', 'world']
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  aiRewritten: {
    type: Boolean,
    default: false
  },
  translations: {
    type: Map,
    of: new mongoose.Schema({
      title: String,
      content: String,
      summary: String
    }, { _id: false }),
    default: {}
  },
  publishedAt: {
    type: Date,
    default: null
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);
