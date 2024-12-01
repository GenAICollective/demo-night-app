const awards = [
  {
    name: "🏆 Best Overall",
    description: "Award for the best overall demo!",
  },
  {
    name: "🤖 Best Technology",
    description: "Award for the most technically impressive demo!",
  },
  {
    name: "🎨 Best Design",
    description: "Award for the most visually appealing demo!",
  },
];

export const DEFAULT_AWARDS = awards.map((award, index) => ({
  name: award.name,
  description: award.description,
  index: index,
}));
