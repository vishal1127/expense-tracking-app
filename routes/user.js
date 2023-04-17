const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");

router.post("/createUser", userControllers.createUser);

router.post("/signInUser", userControllers.loginUser);

module.exports = router;
