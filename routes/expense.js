const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");
const expenseControllers = require("../controllers/expense");

router.post("/addExpense", authMiddleware, expenseControllers.addExpense);

router.get(
  "/getExpenseList/:startDate/:endDate",
  authMiddleware,
  expenseControllers.getAllExpenses
);

router.get("/getExpense/:expId", authMiddleware, expenseControllers.getExpense);

router.post(
  "/updateExpense/:expId",
  authMiddleware,
  expenseControllers.postEditExpense
);

router.delete(
  "/deleteExpense/:expId",
  authMiddleware,
  expenseControllers.deleteExpense
);

module.exports = router;
