const express = require("express");
const app = express();
const port = 8000;
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./configs/db");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
connectDB();

app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/kitchen", require("./routes/kitchenRoutes")); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 