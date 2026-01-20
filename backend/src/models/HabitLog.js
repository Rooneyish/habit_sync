const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: [true, 'Habit ID is required']
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: [true, 'Date is required'],
    validate: {
      validator: function(v) {
        // Validate YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0,
    min: [0, 'Value cannot be negative']
  },
  unit: {
    type: String,
    default: null,
    trim: true
  }
}, {
  timestamps: true
});

// Compound unique index: one log per habit per day (CRITICAL)
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Index for efficient date-based queries
habitLogSchema.index({ date: -1 });

module.exports = mongoose.model('HabitLog', habitLogSchema);