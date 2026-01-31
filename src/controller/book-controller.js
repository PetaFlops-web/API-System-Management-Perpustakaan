import { searchBooksByCatgory } from "../services/book-service.js";

const searchBooksController = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const pageSize = Math.min(
      Math.max(parseInt(req.query.pageSize ?? "10", 10), 1),
      100,
    );

    const books = await searchBooksByCatgory(categoryName, page, pageSize);
    res.status(200).json({
      status: "success",
      data: books.findBooks,
      meta: { page, pageSize, total: books.totalBooks },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default { searchBooks: searchBooksController };
