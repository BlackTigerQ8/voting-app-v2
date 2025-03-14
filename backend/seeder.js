const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User } = require("./models/userModel");
const Athlete = require("./models/athleteModel");
const connectDB = require("./config/db.js");

connectDB();

// Function to create Admin
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const admin = await User.findOne({ role: "Admin" });
    if (admin) {
      console.log("Admin account already exists");
      return;
    }

    // Create new admin user
    const newAdmin = new User({
      firstName: "Abdullah",
      lastName: "Alenezi",
      phone: "66850080",
      idNumber: "295072100108",
      email: "admin@gmail.com",
      password: "123123",
      confirmPassword: "123123",
      role: "Admin",
    });

    await newAdmin.save();
    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Error creating admin account", error);
  }
};

function generateRandomDOB(startYear = 1980, endYear = 2000) {
  const year =
    Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // Days between 1 and 28 (to avoid invalid dates)
  return new Date(year, month, day).toISOString().split("T")[0]; // returns in YYYY-MM-DD format
}

// Function to create Athletes
const createAthletes = async () => {
  try {
    const admin = await User.findOne({ role: "Admin" });
    if (!admin) {
      console.log("Admin not found. Please create an admin first.");
      return;
    }

    // First, delete existing athletes
    // await Athlete.deleteMany({});
    // console.log("Existing athletes deleted");

    const athletes = [
      {
        firstName: "Mohammed",
        lastName: "Ali",
        idNumber: "196501010001",
        dateOfBirth: new Date("1942-01-17"),
        event: "Boxing",
        description:
          "Legendary heavyweight boxer known for his quick footwork and powerful punches.",
        image: "uploads/athlete-images/mohammed-ali.jpg",
        createdBy: admin._id,
      },
      {
        firstName: "Usain",
        lastName: "Bolt",
        idNumber: "198608210002",
        dateOfBirth: new Date("1986-08-21"),
        event: "Sprint",
        description:
          "World record holder in 100m and 200m sprints. Known as the fastest man in history.",
        image: "uploads/athlete-images/usain-bolt.jpg",
        createdBy: admin._id,
      },
      {
        firstName: "Simone",
        lastName: "Biles",
        idNumber: "199703140003",
        dateOfBirth: new Date("1997-03-14"),
        event: "Gymnastics",
        description:
          "Most decorated gymnast in World Championship history with 25 medals.",
        image: "uploads/athlete-images/simone-biles.jpg",
        createdBy: admin._id,
      },
      {
        firstName: "Lionel",
        lastName: "Messi",
        idNumber: "198706240004",
        dateOfBirth: new Date("1987-06-24"),
        event: "Football",
        description:
          "Eight-time Ballon d'Or winner and considered one of the greatest footballers of all time.",
        image: "uploads/athlete-images/lionel-messi.jpg",
        createdBy: admin._id,
      },
      {
        firstName: "Serena",
        lastName: "Williams",
        idNumber: "198109260005",
        dateOfBirth: new Date("1981-09-26"),
        event: "Tennis",
        description:
          "23-time Grand Slam singles champion and former world No. 1 tennis player.",
        image: "uploads/athlete-images/serena-williams.jpg",
        createdBy: admin._id,
      },
      {
        firstName: "Michael",
        lastName: "Phelps",
        idNumber: "198506300006",
        dateOfBirth: new Date("1985-06-30"),
        event: "Swimming",
        description:
          "Most decorated Olympian of all time with 28 medals, including 23 gold medals.",
        image: "uploads/athlete-images/michael-phelps.jpg",
        createdBy: admin._id,
      },
    ];

    const createdAthletes = await Athlete.insertMany(athletes);
    console.log("Athletes created successfully");
    return createdAthletes;
  } catch (error) {
    console.error("Error creating athletes:", error);
  }
};

// Function to delete all users
const deleteAllUsers = async () => {
  try {
    await User.deleteMany({});
    console.log("All users deleted");
  } catch (error) {
    console.error("Error deleting users:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Uncomment the relevant function call as needed
// createAdmin();
// deleteAllUsers();
createAthletes();
