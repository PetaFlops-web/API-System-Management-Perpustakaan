import prisma from "../config/db.js";

const findByIdUser = async (email) => {
  // mencari user bedasarkan email
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
  return user;
};

export { findByIdUser };
