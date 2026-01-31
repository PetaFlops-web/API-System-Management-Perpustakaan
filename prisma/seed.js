import prisma from "../src/config/db.js";

async function main() {
  console.log("🌱 Start seeding...");

  await prisma.loan.deleteMany();
  await prisma.categoryOnBook.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@library.com",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Member User",
      email: "member@library.com",
      role: "MEMBER",
    },
  });

  console.log("✅Users created");

  const catFisika = await prisma.category.create({
    data: {
      name: "Fisika",
    },
  });

  const catSains = await prisma.category.create({
    data: {
      name: "Sains",
    },
  });

  const catSejarah = await prisma.category.create({
    data: {
      name: "Sejarah",
    },
  });

  console.log("✅ Categories created");

  await prisma.book.create({
    data: {
      title: "Sherlock Holmes",
      author: "Arthur Conan Doyle",
      stock: 5,
      categories: {
        create: [{ category: { connect: { id: catFisika.id } } }],
      },
    },
  });

  await prisma.book.create({
    data: {
      title: "Fourth Estate",
      author: "John Grisham",
      stock: 10,
      categories: {
        create: [{ category: { connect: { id: catSejarah.id } } }],
      },
    },
  });

  await prisma.book.create({
    data: {
      title: "Sience of Mind",
      author: "Arthur Conan Doyle",
      stock: 4,
      categories: {
        create: [{ category: { connect: { id: catSains.id } } }],
      },
    },
  });

  await prisma.book.create({
    data: {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      stock: 5,
      categories: {
        create: [
          { category: { connect: { id: catSains.id } } },
          { category: { connect: { id: catSejarah.id } } },
        ],
      },
    },
  });

  await prisma.book.create({
    data: {
      title: "Tools of Titans",
      author: "Tim Ferriss",
      stock: 10,
      categories: {
        create: [
          { category: { connect: { id: catFisika.id } } },
          { category: { connect: { id: catSejarah.id } } },
        ],
      },
    },
  });

  console.log("✅ Books created");

  console.log("🚀 Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
