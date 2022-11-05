const app = require("./server")
const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 3002


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});