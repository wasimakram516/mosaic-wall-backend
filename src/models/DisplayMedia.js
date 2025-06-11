const mongoose = require('mongoose');

const DisplayMediaSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    enum: ['mosaic', 'card'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DisplayMedia', DisplayMediaSchema);
