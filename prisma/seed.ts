import { PrismaClient } from "@prisma/client";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "zain",
      email: "zain@zain.com",
    },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "First Post",
      content: "This is my first post",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Second Post",
      content: "This is my second post",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log({ user, post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
