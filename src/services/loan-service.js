import prisma from "../config/db.js";

const borrowBook = async (userId, bookId, dueDate) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: { id: userId, role: "MEMBER" },
    });

    if (!user) throw new Error("invalid user or not a member");

    const book = await tx.book.findUnique({
      where: { id: bookId },
      select: { id: true, stock: true },
    });

    if (!book) throw new Error("Book not found");
    if (book.stock < 1) throw new Error("Book out of stock");

    const maxBorrow = 3;
    const activeLoanCount = await tx.loan.count({
      where: { userId, returnedAt: null },
    });
    if (activeLoanCount >= maxBorrow) {
      throw new Error("User has reached the maximum loan limit");
    }

    // Buat loan
    const newLoan = await tx.loan.create({
      data: {
        userId,
        bookId,
        dueDate,
      },
    });

    // Kurangi stok secara atomic
    await tx.book.update({
      where: { id: bookId },
      data: { stock: { decrement: 1 } },
    });

    return newLoan;
  });
};

const returnBook = async (loanId) => {
  return prisma.$transaction(async (tx) => {
    const existingLoan = await tx.loan.findUnique({
      where: { id: loanId },
      select: { id: true, bookId: true, returnedAt: true },
    });

    if (!existingLoan) throw new Error("Loan not found");
    if (existingLoan.returnedAt) throw new Error("Loan already returned");

    const book = await tx.book.findUnique({
      where: { id: existingLoan.bookId },
      select: { id: true },
    });
    if (!book) throw new Error("Book not found");

    const returnedLoan = await tx.loan.update({
      where: { id: loanId },
      data: { returnedAt: new Date() },
    });

    await tx.book.update({
      where: { id: existingLoan.bookId },
      data: { stock: { increment: 1 } },
    });

    return returnedLoan;
  });
};

export { borrowBook, returnBook };
