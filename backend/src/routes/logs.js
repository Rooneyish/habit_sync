const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

/**
 * Log Routes
 * Base: /api/logs
 */

// GET /api/logs/today - Get all logs for today
router.get('/today', logController.getTodayLogs);

// POST /api/logs - Create or update log (idempotent)
router.post('/', logController.upsertLog);

// GET /api/logs/habit/:habitId - Get all logs for a habit
router.get('/habit/:habitId', logController.getHabitLogs);

// GET /api/logs/habit/:habitId/analytics - Get analytics for a habit
router.get('/habit/:habitId/analytics', logController.getHabitAnalytics);

module.exports = router;