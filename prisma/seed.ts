import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
    },
  });

  const demos = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-${index + 1}`,
    name: `Demo ${index + 1}`,
    description: `Demo ${index + 1} description`,
    index: index,
    email: `demo-${index + 1}@example.com`,
    url: `https://example.com`,
  }));

  const awards = Array.from({ length: 3 }, (_, index) => ({
    id: `award-${index + 1}`,
    name: `Award ${index + 1}`,
    description: `Award ${index + 1} description`,
    index: index,
  }));

  await prisma.event.upsert({
    where: { id: "sf-demo" },
    update: {},
    create: {
      id: "sf-demo",
      name: "SF Demo Extravaganza 🚀",
      date: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      url: "https://lu.ma/sf-demo",
      demos: { create: demos },
      awards: { create: awards },
    },
  });
}

main()
  .then(() => {
    console.log("Seeded data");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
