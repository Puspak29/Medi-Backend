const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  capacity: {
    type: Number,
    default: 10
  },
  booked: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]

})

const appointmentSchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor" ,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: { 
    slot1: {
      type: slotSchema,
      default: () => ({})
    },
    slot2: {
      type: slotSchema,
      default: () => ({})
    },
    slot3: {
      type: slotSchema,
      default: () => ({})
    },
    slot4: {
      type: slotSchema,
      default: () => ({})
    }
  }
});

appointmentSchema.index({ doctor: 1, date: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;