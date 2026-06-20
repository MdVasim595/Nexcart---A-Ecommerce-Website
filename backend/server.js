require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/order", require("./routes/order"));
app.use("/api/product", require("./routes/product"));
app.use("/api/user", require("./routes/user"));

app.listen(5000, () => console.log("Server running on 5000"));