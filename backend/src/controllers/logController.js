const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const analyticsService = require('../services/analyticsService');

/**
 * Helper: Get today's date in YYYY-MM-DD format
 */
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * GET /api/logs/today
 * Get all logs for today with populated habit data
 */
exports.getTodayLogs = async (req, res) => {
  try {
    const today = getTodayDate();
    
    const logs = await HabitLog.find({ date: today })
      .populate('habitId')
      .sort({ createdAt: 1 });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching today logs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch today\'s logs',
      message: error.message 
    });
  }
};

/**
 * POST /api/logs
 * Create or update a log (idempotent operation)
 * Body: { habitId, date?, completed?, value? }
 */
exports.upsertLog = async (req, res) => {
  try {
    const { habitId, date, completed, value } = req.body;
    
    // Validation
    if (!habitId) {
      return res.status(400).json({ error: 'Habit ID is required' });
    }
    
    // Verify habit exists
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    if (!habit.active) {
      return res.status(400).json({ error: 'Cannot log inactive habit' });
    }
    
    // Use today's date if not provided
    const logDate = date || getTodayDate();
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
      return res.status(400).json({ 
        error: 'Date must be in YYYY-MM-DD format' 
      });
    }
    
    // Prepare log data based on habit type
    let logData = {
      habitId,
      date: logDate,
      unit: habit.unit
    };
    
    if (habit.type === 'boolean') {
      // Boolean habit: use completed field
      logData.completed = completed === true;
      logData.value = 0;
    } else {
      // Numeric habit: use value field
      const numericValue = Number(value) || 0;
      
      if (numericValue < 0) {
        return res.status(400).json({ error: 'Value cannot be negative' });
      }
      
      logData.value = numericValue;
      logData.completed = numericValue > 0;
    }
    
    // Idempotent upsert: create if doesn't exist, update if exists
    const log = await HabitLog.findOneAndUpdate(
      { habitId, date: logDate },
      logData,
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );
    
    res.json(log);
  } catch (error) {
    console.error('Error upserting log:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to save log',
      message: error.message 
    });
  }
};

/**
 * GET /api/logs/habit/:habitId
 * Get all logs for a specific habit
 */
exports.getHabitLogs = async (req, res) => {
  try {
    const logs = await HabitLog.find({ habitId: req.params.habitId })
      .sort({ date: 1 });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching habit logs:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch logs',
      message: error.message 
    });
  }
};

/**
 * GET /api/logs/habit/:habitId/analytics
 * Get complete analytics for a habit (heatmap + cumulative trend)
 */
exports.getHabitAnalytics = async (req, res) => {
  try {
    // Fetch habit
    const habit = await Habit.findById(req.params.habitId);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    // Fetch all logs for this habit
    const logs = await HabitLog.find({ habitId: req.params.habitId })
      .sort({ date: 1 });
    
    // Compute analytics
    const analytics = analyticsService.computeAnalytics(habit, logs);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching habit analytics:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      error: 'Failed to compute analytics',
      message: error.message 
    });
  }
};