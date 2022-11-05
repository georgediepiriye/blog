const express = require("express");
const app = express();
const morgan = require("morgan");
var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

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
    credentials: true,
  })
);

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);

// home route
app.get('/', (req, res) => {
  return res.status(200).json({ status: true })
})

//unavailable routes
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'route not found' })
})




module.exports = app;