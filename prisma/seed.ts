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

  const demosInfo = [
    {
      name: "Cofactory",
      description: "The future of value creation in an AI-based economy",
    },
    {
      name: "ChatGPT",
      description: "A chatbot for answering questions",
    },
    {
      name: "Revamp",
      description: "Optimize your e-commerce presence",
    },
    {
      name: "Paradigm",
      description: "A new way to think about the world",
    },
    {
      name: "Xpecs",
      description: "A platform for managing your projects",
    },
    {
      name: "Messenger",
      description: "A chat app for sending messages",
    },
    {
      name: "Postman",
      description: "An app for sending HTTP requests",
    },
    {
      name: "Calculator",
      description: "A simple calculator app",
    },
    {
      name: "Spotifly",
      description: "A music streaming app",
    },
    {
      name: "PhotoView",
      description: "Look at photos in a new way",
    },
  ];

  const demos = demosInfo.map((demo, index) => ({
    id: `demo-${index + 1}`,
    name: demo.name,
    description: demo.description,
    index: index,
    email: `demo-${index + 1}@example.com`,
    url: `https://example.com`,
  }));

  const awardsInfo = [
    {
      name: "🎨 Best Design",
      description: "Award for the most visually appealing demo",
    },
    {
      name: "🤖 Best Technology",
      description: "Award for the most technically impressive demo",
    },
    {
      name: "🏆 Best Overall",
      description: "Award for the best overall demo",
    },
  ];

  const awards = awardsInfo.map((award, index) => ({
    id: `award-${index + 1}`,
    name: award.name,
    description: award.description,
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
