const express = require("express");
const app = express();
const morgan = require("morgan");
var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();
const authRoutes = require("./routes/authRoutes");

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(
  cors({
    origin: "*",
    allowedHeaders: "Content-Type,Authorization",
  })
);

//routes
app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running....");
});
