import prisma from "../src/config/db.js";

export const createUser = async () => {
  return prisma.user.create({
    data: {
      name: "Member User",
      email: `member_${Date.now()}@library.com`,
      role: "MEMBER",
    },
  });
};

export const createBook = async () => {
  return prisma.book.create({
    data: {
      title: "Sherlock Holmes",
      author: "Arthur Conan Doyle",
      stock: 5,
      categories: {
        create: [
          {
            category: {
              connectOrCreate: {
                where: { name: "Fisika" },
                create: { name: "Fisika" },
              },
            },
          },
        ],
      },
    },
  });
};

export const createLoan = async (userId, bookId, dueDate) => {
  return prisma.loan.create({
    data: {
      userId,
      bookId,
      dueDate,
    },
  });
};

export const returnBookDummy = async (loanId) => {
  return prisma.loan.update({
    where: { id: loanId },
    data: { returnedAt: new Date() },
  });
};

export const clearUsers = async () => {
  return prisma.user.deleteMany();
};

export const clearBooks = async () => {
  await prisma.categoryOnBook.deleteMany();
  await prisma.book.deleteMany();
};

export const clearCategories = async () => {
  return prisma.category.deleteMany();
};

export const clearLoans = async () => {
  return prisma.loan.deleteMany();
};
