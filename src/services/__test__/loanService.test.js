import {
  createBook,
  createUser,
  clearBooks,
  clearLoans,
  clearUsers,
  clearCategories,
  createLoan,
  returnBookDummy,
} from "../../../tests/dummy.js";
import { borrowBook, returnBook } from "../loan-service.js";
import prisma from "../../config/db.js";
import { afterEach, describe, beforeEach, expect, test } from "@jest/globals";

describe("Testing Service Loans", () => {
  beforeEach(async () => {
    await createUser();
    await createBook();
  });

  afterEach(async () => {
    await clearLoans();
    await clearBooks();
    await clearCategories();
    await clearUsers();
  });

  test("Should borrow a book", async () => {
    const user = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    const book = await prisma.book.findFirst({ where: { stock: { gt: 0 } } });

    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const loan = await borrowBook(user.id, book.id, dueDate);

    expect(loan).not.toBeNull();
  });

  test("should book out of stock", async () => {
    const user = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    const book = await prisma.book.create({
      data: {
        title: "Out of Stock Book",
        author: "Unknown Author",
        stock: 0,
      },
    });

    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    expect(async () => {
      await borrowBook(user.id, book.id, dueDate);
    }).rejects.toThrow("Book out of stock");
  });

  test("Should reject when user exceeds loan limit", async () => {
    const user = await createUser();
    const book = await createBook();

    // loop 3 times to create maximum loans
    for (let i = 0; i < 5; i++) {
      await prisma.loan.create({
        data: {
          userId: user.id,
          bookId: book.id,
          dueDate: new Date(),
        },
      });
    }

    await expect(borrowBook(user.id, book.id, new Date())).rejects.toThrow(
      "User has reached the maximum loan limit",
    );
  });

  test("Should book not found", async () => {
    const user = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    expect(async () => {
      await borrowBook(user.id, 0, new Date());
    }).rejects.toThrow("Book not found");
  });

  test("Should return a book", async () => {
    const user = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    const book = await prisma.book.findFirst({ where: { stock: { gt: 0 } } });
    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const loan = await createLoan(user.id, book.id, dueDate);

    const returnedLoan = await returnBook(loan.id);
    expect(returnedLoan.returnedAt).not.toBeNull();
  });

  test("Should loan already returned", async () => {
    const user = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    const book = await prisma.book.findFirst({ where: { stock: { gt: 0 } } });
    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const loan = await createLoan(user.id, book.id, dueDate);

    const returnedLoan = await returnBookDummy(loan.id);

    await expect(returnBook(returnedLoan.id)).rejects.toThrow(
      "Loan already returned",
    );
  });

  test("Should loan not found", async () => {
    expect(async () => {
      await returnBook(0);
    }).rejects.toThrow("Loan not found");
  })

});
