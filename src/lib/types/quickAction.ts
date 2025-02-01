import { z } from "zod";

export const quickActionSchema = z.object({
  id: z.string(),
  icon: z.string(),
  description: z.string(),
});

export type QuickAction = z.infer<typeof quickActionSchema>;

export const QUICK_ACTIONS_ICON = "🤝";
export const QUICK_ACTIONS_TITLE = "I want to..."; // "I want to help by...";

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "testProduct",
    icon: "🧑‍💻",
    description: "Test the product!",
  },
  {
    id: "workWithUs",
    icon: "💼",
    description: "Work with you!",
  },
  {
    id: "invest",
    icon: "💰",
    description: "Learn about investing!",
  },
  // {
  //   id: "hopOnCall",
  //   icon: "☎️",
  //   description: "Hopping on a call!",
  // },
  // {
  //   id: "shareWithFriends",
  //   icon: "🙌",
  //   description: "Sharing with my friends!",
  // },
];
