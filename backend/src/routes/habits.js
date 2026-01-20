const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

/**
 * Habit Routes
 * Base: /api/habits
 */

// GET /api/habits - Get all active habits
router.get('/', habitController.getAllHabits);

// POST /api/habits - Create new habit
router.post('/', habitController.createHabit);

// GET /api/habits/:id - Get single habit
router.get('/:id', habitController.getHabit);

// PATCH /api/habits/:id - Update habit (archive/activate)
router.patch('/:id', habitController.updateHabit);

// DELETE /api/habits/:id - Delete habit
router.delete('/:id', habitController.deleteHabit);

module.exports = router;