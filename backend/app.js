const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const userRouter = require("./routes/userRoutes");
const athleteRouter = require("./routes/athleteRoutes");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///// MIDDLEWARE /////
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/users", userRouter);
app.use("/api/athletes", athleteRouter);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
