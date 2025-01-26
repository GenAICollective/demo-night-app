import { type Partner } from "./types/partner";

export const DEFAULT_DEMOS = [
  {
    name: "Demo Night App",
    description: "The app that powers Demo Nights!",
    email: "demonight@genaicollective.ai",
    url: "https://demos.genaicollective.ai",
    index: 0,
  },
];

export const DEFAULT_AWARDS = [
  {
    name: "🏆 Best Overall",
    description: "The ultimate standout demo of the night!",
    index: 0,
  },
  {
    name: "🤖 Best Technology",
    description: "The demo that amazed us with tech brilliance!",
    index: 1,
  },
  {
    name: "🎨 Most Creative",
    description: "The demo that dazzled with originality and flair!",
    index: 2,
  },
];

export const DEFAULT_PARTNERS: Partner[] = [
  {
    name: "The GenAI Collective",
    url: "https://www.genaicollective.ai",
    description:
      "A global community for the brightest minds in AI to discuss, exchange, and innovate",
  },
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com",
    description:
      "The place to discover your next favorite thing. Launch, share, and discover new products in tech.",
  },
];
