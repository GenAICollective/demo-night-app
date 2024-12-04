const awards = [
  {
    name: "🏆 Best Overall",
    description: "The ultimate standout demo of the night!",
  },
  {
    name: "🤖 Best Technology",
    description: "The demo that amazed us with tech brilliance!",
  },
  {
    name: "🎨 Most Creative",
    description: "The demo that dazzled with originality and flair!",
  },
];

export const DEFAULT_AWARDS = awards.map((award, index) => ({
  name: award.name,
  description: award.description,
  index: index,
}));
