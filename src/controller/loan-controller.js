import { borrowBook, returnBook } from "../services/loan-service.js";

const borrowBookController = async (req, res) => {
  try {
    const { userId, bookId, dueDate } = req.body;

    if (!userId || !bookId || !dueDate) {
      throw new Error("userId, bookId, and dueDate are required");
    }

    const [y, m, d] = dueDate.split("-").map(Number);
    const dueDateObj = new Date(y, m - 1, d);

    const loan = await borrowBook(userId, bookId, dueDateObj);
    res.status(200).json({
      status: "success",
      data: loan,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const returnBookController = async (req, res) => {
  try {
    const { loanId } = req.params;
    const returnedLoan = await returnBook(parseInt(loanId));
    res.status(200).json({
      status: "success",
      data: returnedLoan,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default {
  borrowBook: borrowBookController,
  returnBook: returnBookController,
};
