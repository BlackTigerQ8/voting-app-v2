const Athlete = require("../models/athleteModel");

// @desc    Get all athletes
// @route   GET /api/athletes
// @access  Public
const getAllAthletes = async (req, res) => {
  try {
    const athletes = await Athlete.find()
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    res.status(200).json({
      status: "Success",
      data: {
        athletes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Get single athlete
// @route   GET /api/athletes/:id
// @access  Public
const getAthlete = async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!athlete) {
      return res.status(404).json({
        status: "Error",
        message: "Athlete not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        athlete,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Create new athlete
// @route   POST /api/athletes
// @access  Private/Admin
const createAthlete = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    // if (!filePath) {
    //   return res.status(400).json({
    //     status: "Error",
    //     message: "Athlete image is required",
    //   });
    // }

    // Validate ID Number format
    if (!/^\d{12}$/.test(req.body.idNumber)) {
      return res.status(400).json({
        status: "Error",
        message: "ID number must be exactly 12 digits",
      });
    }

    // Validate Date of Birth
    const dateOfBirth = new Date(req.body.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid date of birth format",
      });
    }

    // Check if athlete with same ID number already exists
    const existingAthlete = await Athlete.findOne({
      idNumber: req.body.idNumber,
    });
    if (existingAthlete) {
      return res.status(400).json({
        status: "Error",
        message: "An athlete with this ID number already exists",
      });
    }

    const athlete = await Athlete.create({
      ...req.body,
      idNumber: parseInt(req.body.idNumber),
      dateOfBirth,
      image: filePath,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "Success",
      data: {
        athlete,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update athlete
// @route   PUT /api/athletes/:id
// @access  Private/Admin
const updateAthlete = async (req, res) => {
  try {
    // Check if the user is accessing their own data or is an admin
    if (
      req.user.id !== req.params.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "SuperAdmin"
    ) {
      return res.status(403).json({
        status: "Error",
        message: "You do not have permission to access this user's data",
      });
    }

    const uploadedFile = req.file;

    // Prepare the updated data
    const updateData = { ...req.body };

    // Only update image field if a new file was uploaded
    if (uploadedFile) {
      updateData.image = uploadedFile.path;
    }

    // Remove image field if no new file was uploaded
    if (!uploadedFile && !updateData.image) {
      delete updateData.image;
    }

    const athlete = await Athlete.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!athlete) {
      return res.status(404).json({
        status: "Error",
        message: "Athlete not found",
      });
    }

    console.log("Athlete updated:", athlete);

    res.status(200).json({
      status: "Success",
      data: {
        athlete,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete athlete
// @route   DELETE /api/athletes/:id
// @access  Private/Admin
const deleteAthlete = async (req, res) => {
  try {
    const athlete = await Athlete.findByIdAndDelete(req.params.id);

    if (!athlete) {
      return res.status(404).json({
        status: "Error",
        message: "Athlete not found",
      });
    }

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllAthletes,
  getAthlete,
  createAthlete,
  updateAthlete,
  deleteAthlete,
};
