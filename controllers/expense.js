const Expense = require("../models/expense");

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, category, description } = req.body;
    const newExpense = new Expense({
      amount: amount,
      category: category,
      description: description,
      userId: req.user,
    });
    const expense = await newExpense.save();
    res.status(200).json({
      message: "Expense added",
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    // const allExpensesCount
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page) || 1;
    const allExpenses = await Expense.find({
      userId: req.user,
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ],
    })
      .skip((page - 1) * pageSize ? (page - 1) * pageSize : 0)
      .limit(pageSize ? pageSize : null);
    //   const allExpensess = await UserServices.getExpenses(req, {
    //     where: {
    //       createdAt: {
    //         [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
    //       },
    //     },
    //     offset: (page - 1) * pageSize ? (page - 1) * pageSize : 0,
    //     limit: pageSize ? pageSize : null,
    //   });
    const totalCount = await Expense.find({
      userId: req.user,
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ],
    }).count();
    //   const totalCountt = await UserServices.countTotalExpenses(req, {
    //     where: {
    //       createdAt: {
    //         [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
    //       },
    //     },
    //   });
    res.status(201).json({
      expenseList: allExpenses,
      currentPage: page,
      hasNextPage: pageSize * page < totalCount,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalCount / pageSize),
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expId = req.params.expId;
    const deletedExp = await Expense.findByIdAndRemove(expId);
    res.status(200).json({
      message: "Expense deleted",
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const expId = req.params.expId;
    const expense = await Expense.findOne({ _id: expId });
    res.status(200).json({
      message: "Expense fetched",
      expenseData: expense,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.postEditExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;
    const expId = req.params.expId;
    const expense = await Expense.findOne({ _id: expId });
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    expense.save();
    res.status(200).json({
      message: "Expense updated",
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
