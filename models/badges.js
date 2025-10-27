const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  conditionType: {
    type: String,
    required: true
  }, // e.g., "patientsTreated", "reviews", "yearsOfExperience"
  threshold: {
    type: Number,
    required: true
  }
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;