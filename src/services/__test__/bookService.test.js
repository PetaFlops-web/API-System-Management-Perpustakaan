import prisma from "../../config/db.js";
import { afterEach, describe, beforeEach, expect, test } from "@jest/globals";
import { searchBooksByCatgory } from "../book-service.js";
import { createBook } from "../../../tests/dummy.js";

describe("Testing Service Books", () => {
  beforeEach(async () => {
    await createBook();
  });

  afterEach(async () => {
    await prisma.categoryOnBook.deleteMany();
    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
  });

  test("Should search book by category", async () => {
    const books = await searchBooksByCatgory("Fisika", 1, 10);
    expect(books.findBooks.length).toBe(1);
  });

  test("Should return empty array when category not found", async () => {
    await expect(searchBooksByCatgory("Matematika", 1, 10)).rejects.toThrow(
      "No books found for the given category",
    );
  });

  test("Should paginate results", async () => {
    const books = await searchBooksByCatgory("Fisika", 1, 1);
    expect(books.findBooks.length).toBe(1);
  });
});
