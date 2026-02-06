import { expect, jest } from "@jest/globals";
import { mockResponse } from "../../../tests/testUtils.js";

const mockBorrowBook = jest.fn();
const mockReturnBook = jest.fn();

jest.unstable_mockModule("../../services/loan-service.js", () => ({
  borrowBook: mockBorrowBook,
  returnBook: mockReturnBook,
}));

const loanController = (await import("../loan-controller.js")).default;

const borrowBookController = loanController.borrowBook;

describe("Borrow Book Controller", () => {
  test("success borrow book", async () => {
    const req = {
      body: {
        userId: 1,
        bookId: 2,
        dueDate: "2026-02-10",
      },
    };

    const res = mockResponse();

    mockBorrowBook.mockResolvedValue({ id: 99 });

    await borrowBookController(req, res);

    expect(mockBorrowBook).toHaveBeenCalledWith(1, 2, expect.any(Date));

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("missing field", async () => {
    const req = { body: {} };
    const res = mockResponse();

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("service error", async () => {
    const req = {
      body: {
        userId: 1,
        bookId: 2,
        dueDate: "2026-02-10",
      },
    };

    const res = mockResponse();

    mockBorrowBook.mockRejectedValue(new Error("Loan limit reached"));

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("return book controller", async () => {
    const req = {
      params: {
        loanId: "42",
      },
    };

    const res = mockResponse();

    mockReturnBook.mockResolvedValue({
      id: 42,
      returned: true,
    });

    await loanController.returnBook(req, res);

    expect(mockReturnBook).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: {
        id: 42,
        returned: true,
      },
    });
  });

  test("return book controller error", async () => {
    const req = {
      params: {
        loanId: "42",
      },
    };

    const res = mockResponse();

    mockReturnBook.mockRejectedValue(new Error("Loan not found"));

    await loanController.returnBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
