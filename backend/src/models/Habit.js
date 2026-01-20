const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    minlength: [1, 'Habit name cannot be empty'],
    maxlength: [100, 'Habit name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['boolean', 'numeric'],
      message: 'Type must be either boolean or numeric'
    },
    required: [true, 'Habit type is required']
  },
  unit: {
    type: String,
    default: null,
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
habitSchema.index({ active: 1, createdAt: -1 });

// Validation: numeric habits must have a unit
// Validation: numeric habits must have a unit
habitSchema.pre('save', async function() {
  // 'this' refers to the document being saved
  
  if (this.type === 'numeric' && !this.unit) {
    // Throwing an error inside an async middleware 
    // is the same as calling next(err)
    throw new Error('Numeric habits must have a unit');
  }
  
  // Boolean habits should not have a unit
  if (this.type === 'boolean') {
    this.unit = null;
  }
  
  // No need to call next() in an async function!
});

module.exports = mongoose.model('Habit', habitSchema);