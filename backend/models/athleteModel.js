const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "You need to enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "You need to enter your last name"],
  },
  idNumber: {
    type: Number,
    required: [true, "ID number is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{12}$/.test(v.toString());
      },
      message: (props) =>
        `${props.value} is not a valid ID number! Must be exactly 12 digits`,
    },
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  event: {
    type: String,
    required: [true, "You need to enter athlete's event"],
  },
  description: {
    type: String,
    required: [true, "You need to enter athlete's description"],
  },
  image: {
    type: String,
    // required: [true, "You need to upload athlete's image"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Athlete", athleteSchema);
