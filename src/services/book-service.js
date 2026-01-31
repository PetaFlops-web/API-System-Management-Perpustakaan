import prisma from "../config/db.js";

const findBookById = async (bookId) => {
  const { id } = bookId;
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
    select: {
      title: true,
      author: true,
      stock: true,
    },
  });
  return book;
};

const searchBooksByCatgory = async (categoryName, page, pageSize) => {
  const books = await prisma.$transaction(async (tx) => {
    const findBooks = await tx.book.findMany({
      where: {
        categories: {
          some: {
            category: { name: { contains: categoryName, mode: "insensitive" } },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "desc" },
    });

    const totalBooks = await tx.book.count({
      where: {
        categories: {
          some: { category: { name: { contains: categoryName } } },
        },
      },
    });

    return { findBooks, totalBooks };
  });
  return books;
};

export { findBookById, searchBooksByCatgory };
