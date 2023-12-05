const express = require('express');
const { PrismaClient, Status } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/task
router.get(
  '/',
  /* auth, */ async (req, res) => {
    try {
      const include = req.query.include_user;
      console.log(include);
      const tasks = await prisma.task.findMany({
        include: {
          user: include === 'true' ? true : false,
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/task/:id
router.get(
  '/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const include = req.query.include_user;
      const task = await prisma.task.findUnique({
        where: {
          id: id,
        },
        include: {
          user: Boolean(include),
        },
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/task/user/:user_id
router.get(
  '/user/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await prisma.task.findMany({
        where: {
          user_id: id,
        },
        include: {
          user: true,
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/task
router.post(
  '/',
  [check('title').notEmpty().withMessage('Title is required').trim()],
  /* auth, */ async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }
      const { title, user_id } = req.body;
      const task = await prisma.task.create({
        data: {
          title: title,
          status: Status.todo,
        },
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/task/:id
router.put(
  '/:id',
  [
    check('title').notEmpty().withMessage('Title is required').trim(),
    check('status').notEmpty().withMessage('Status is required').trim(),
    check('user_id').notEmpty().withMessage('User id is required').trim(),
  ],
  /* auth, */ async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { title, status, user_id } = req.body;
      const task = await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          status: status,
          user_id: user_id,
        },
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE /api/task/:id

router.delete(
  '/:id',
  /* auth, */ async (req, res) => {
    try {
      const { id } = req.params;
      const task = await prisma.task.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
