const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

/**
 * GET /api/habits
 * Get all active habits sorted by creation date
 */
exports.getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ active: true }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch habits',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * POST /api/habits
 * Create a new habit
 * Body: { name, type, unit? }
 */
exports.createHabit = async (req, res) => {
  try {
    console.log('=== CREATE HABIT REQUEST ===');
    console.log('Request body:', req.body);
    
    const { name, type, unit } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      console.log('Validation failed: name is required');
      return res.status(400).json({ error: 'Habit name is required' });
    }
    
    if (!type) {
      console.log('Validation failed: type is required');
      return res.status(400).json({ error: 'Habit type is required' });
    }
    
    if (!['boolean', 'numeric'].includes(type)) {
      console.log('Validation failed: invalid type:', type);
      return res.status(400).json({ 
        error: 'Type must be either "boolean" or "numeric"' 
      });
    }
    
    if (type === 'numeric' && (!unit || !unit.trim())) {
      console.log('Validation failed: unit required for numeric');
      return res.status(400).json({ 
        error: 'Unit is required for numeric habits' 
      });
    }
    
    // Create habit
    const habitData = {
      name: name.trim(),
      type,
      unit: type === 'numeric' ? unit.trim() : null
    };
    
    console.log('Creating habit with data:', habitData);
    
    const habit = new Habit(habitData);
    
    console.log('Saving habit to database...');
    await habit.save();
    
    console.log('Habit created successfully:', habit);
    res.status(201).json(habit);
  } catch (error) {
    console.error('!!! ERROR CREATING HABIT !!!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: error.message,
        details: error.errors
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create habit',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * GET /api/habits/:id
 * Get a single habit by ID
 */
exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch habit',
      message: error.message 
    });
  }
};

/**
 * PATCH /api/habits/:id
 * Update habit (archive/activate)
 * Body: { active }
 */
exports.updateHabit = async (req, res) => {
  try {
    const { active } = req.body;
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({ 
        error: 'Active field must be a boolean' 
      });
    }
    
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      error: 'Failed to update habit',
      message: error.message 
    });
  }
};

/**
 * DELETE /api/habits/:id
 * Delete a habit and all its logs
 */
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    // Delete all associated logs
    await HabitLog.deleteMany({ habitId: req.params.id });
    
    res.json({ 
      message: 'Habit and all associated logs deleted successfully',
      habitId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting habit:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete habit',
      message: error.message 
    });
  }
};
