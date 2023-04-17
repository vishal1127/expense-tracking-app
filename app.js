require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(userRoutes);
app.use(expenseRoutes);

const uri =
  "mongodb+srv://vishal:admin@expensetrackerapp.7rdhdeb.mongodb.net/ExpenseTracker?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
