require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_TOKEN = process.env.JWT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    const cookie = req.cookies[JWT_TOKEN];

    if (!cookie) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(cookie, JWT_SECRET);
    console.log(decoded);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const valid = new Date(decoded.exp * 1000) > new Date();

    if (!valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = auth;
