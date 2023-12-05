const express = require('express');

const router = express.Router();

const userRoutes = require('./user');
const taskRoutes = require('./task');

router.use('/user', userRoutes);
router.use('/task', taskRoutes);

module.exports = router;
