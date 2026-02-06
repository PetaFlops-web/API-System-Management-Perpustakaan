import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// mock controllers
const mockGetUser = jest.fn((req, res) => res.sendStatus(200));
const mockBorrow = jest.fn((req, res) => res.sendStatus(200));
const mockReturn = jest.fn((req, res) => res.sendStatus(200));
const mockSearch = jest.fn((req, res) => res.sendStatus(200));

jest.unstable_mockModule("../../controller/user-controller.js", () => ({
  default: { getUserById: mockGetUser },
}));

jest.unstable_mockModule("../../controller/loan-controller.js", () => ({
  default: {
    borrowBook: mockBorrow,
    returnBook: mockReturn,
  },
}));

jest.unstable_mockModule("../../controller/book-controller.js", () => ({
  default: { searchBooks: mockSearch },
}));

const router = (await import("../router.js")).default;

const app = express();
app.use(express.json());
app.use(router);

describe("Router test", () => {
  test("GET /users/:email", async () => {
    await request(app).get("/users/test@mail.com");

    expect(mockGetUser).toHaveBeenCalled();
  });

  test("POST /borrow", async () => {
    await request(app).post("/borrow");

    expect(mockBorrow).toHaveBeenCalled();
  });

  test("POST /return/:loanId", async () => {
    await request(app).post("/return/42");

    expect(mockReturn).toHaveBeenCalled();
  });

  test("GET /books/:categoryName", async () => {
    await request(app).get("/books/novel");

    expect(mockSearch).toHaveBeenCalled();
  });
});
