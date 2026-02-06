import { expect, jest } from "@jest/globals";
import { mockResponse } from "../../../tests/testUtils.js";

const mockSearchBooks = jest.fn();

jest.unstable_mockModule("../../services/book-service.js", () => ({
  searchBooksByCatgory: mockSearchBooks,
}));

const bookController = (await import("../book-controller.js")).default;
const searchBooksController = bookController.searchBooks;

describe("Search Books Controller", () => {
  test("success search books", async () => {
    const req = {
      params: { categoryName: "novel" },
      query: { page: "2", pageSize: "5" },
    };

    const res = mockResponse();

    mockSearchBooks.mockResolvedValue({
      findBooks: [{ id: 1, title: "Book A" }],
      totalBooks: 20,
    });

    await searchBooksController(req, res);

    expect(mockSearchBooks).toHaveBeenCalledWith("novel", 2, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: [{ id: 1, title: "Book A" }],
      meta: { page: 2, pageSize: 5, total: 20 },
    });
  });

  test("default pagination values", async () => {
    const req = {
      params: { categoryName: "history" },
      query: {},
    };

    const res = mockResponse();

    mockSearchBooks.mockResolvedValue({
      findBooks: [],
      totalBooks: 0,
    });

    await searchBooksController(req, res);

    expect(mockSearchBooks).toHaveBeenCalledWith("history", 1, 10);
  });

  test("pagination boundary enforced", async () => {
    const req = {
      params: { categoryName: "science" },
      query: { page: "-5", pageSize: "999" },
    };

    const res = mockResponse();

    mockSearchBooks.mockResolvedValue({
      findBooks: [],
      totalBooks: 0,
    });

    await searchBooksController(req, res);

    expect(mockSearchBooks).toHaveBeenCalledWith("science", 1, 100);
  });

  test("service error handled", async () => {
    const req = {
      params: { categoryName: "tech" },
      query: {},
    };

    const res = mockResponse();

    mockSearchBooks.mockRejectedValue(new Error("DB error"));

    await searchBooksController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "DB error",
    });
  });
});
