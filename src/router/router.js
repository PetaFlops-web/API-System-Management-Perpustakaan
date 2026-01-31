import { Router } from "express";
import controllerUser from "../controller/user-controller.js";
import controllerLoan from "../controller/loan-controller.js";
import controllerBook from "../controller/book-controller.js";
const router = Router();

router.get("/users/:email", controllerUser.getUserById);
router.post("/borrow", controllerLoan.borrowBook);
router.post("/return/:loanId", controllerLoan.returnBook);
router.get("/books/:categoryName", controllerBook.searchBooks);

export default router;
