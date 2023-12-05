require('dotenv').config();

const JWT_TOKEN = process.env.JWT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    console.log({ cookies: req.cookies });
    const cookie = req.cookies[JWT_TOKEN];

    if (!cookie) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = cookie.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
