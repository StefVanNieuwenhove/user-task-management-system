require('dotenv').config();
const express = require('express');
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const SALT = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_TOKEN = process.env.JWT_TOKEN;
const NODE_ENV = process.env.NODE_ENV;

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/user
router.get(
  '/',
  /* auth, */ async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/user/:id
router.get(
  '/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const include = req.query.include_password;
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: include === 'true' ? true : false,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/user/register
router.post(
  '/register',
  [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must be between 3 and 20 characters'),
    check('email').isEmail().withMessage('Email is required').trim(),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Password must be between 5 and 20 characters'),
    check('role')
      .notEmpty()
      .withMessage('Role is required')
      .trim()
      .isIn([Role.manager, Role.employee]),
  ],
  async (req, res) => {
    try {
      const { errors } = validationResult(req);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const { name, email, password, role } = req.body;

      const userExists = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (userExists) {
        return res.status(500).json('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, Number(SALT));

      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: role,
        },
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

// POST /api/user/login
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Email is required')
      .trim()
      .normalizeEmail(),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (errors.array().length > 0) {
        console.log('Validation ', errors);
        return res.status(500).json('Errors in validation');
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user === null) {
        console.log('User does not exist');
        return res.status(500).json('User does not exist');
      }

      const validPassword = bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(500).json('Invalid password');
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_TOKEN_EXPIRY,
        issuer: JWT_ISSUER,
      });

      res.cookie(JWT_TOKEN, token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
      });

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// PUT /api/user/:id
router.put(
  '/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, parseInt(SALT));
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE /api/user/logout
router.delete('/logout', async (req, res) => {
  try {
    res.clearCookie(JWT_TOKEN);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/user/:id
router.delete(
  '/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
