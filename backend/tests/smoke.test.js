/**
 * Lightweight CI smoke tests — no network, no MongoDB required.
 * Validates core modules load and auth helpers behave correctly.
 */
const assert = require('assert');
const jwt = require('jsonwebtoken');
const path = require('path');

// Models / middleware must load without connecting to DB
const Article = require('../models/Article');
const authMiddleware = require('../middleware/auth');

assert.strictEqual(typeof Article, 'function', 'Article model should export a model');
assert.strictEqual(typeof authMiddleware, 'function', 'auth middleware should be a function');

// Auth middleware rejects missing token
{
  let statusCode = null;
  let body = null;
  const req = { headers: {} };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      body = payload;
      return this;
    },
  };
  let nextCalled = false;
  authMiddleware(req, res, () => {
    nextCalled = true;
  });
  assert.strictEqual(statusCode, 401, 'missing token should return 401');
  assert.ok(body && body.message, 'missing token should return a message');
  assert.strictEqual(nextCalled, false, 'next() must not run without a token');
}

// Auth middleware accepts a valid JWT
{
  const secret = 'ci-smoke-secret';
  process.env.JWT_SECRET = secret;
  const token = jwt.sign({ username: 'admin', role: 'admin' }, secret, {
    expiresIn: '1h',
  });

  let statusCode = null;
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };
  let nextCalled = false;
  authMiddleware(req, res, () => {
    nextCalled = true;
  });
  assert.strictEqual(statusCode, null, 'valid token should not set error status');
  assert.strictEqual(nextCalled, true, 'next() must run with a valid token');
  assert.strictEqual(req.admin.username, 'admin');
  assert.strictEqual(req.admin.role, 'admin');
}

// Routes must be exportable
assert.ok(require('../routes/authRoutes'));
assert.ok(require('../routes/newsRoutes'));
assert.ok(require('../routes/adminRoutes'));
assert.ok(require('../routes/translateRoutes'));
assert.ok(require('../services/newsService'));
assert.ok(require('../services/geminiService'));

console.log('Smoke tests passed:', path.basename(__filename));
