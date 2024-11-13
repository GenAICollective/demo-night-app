type QuickAction = {
  icon: string;
  description: string;
  visible?: boolean;
};

export const icon = "🤝";

export const title = "I want to..."; // "I want to help by...";

// Note: do not remove any actions. Only add new ones!
export const actions: Record<string, QuickAction> = {
  testProduct: {
    icon: "🧑‍💻",
    description: "Test the product!",
    visible: true,
  },
  workWithUs: {
    icon: "💼",
    description: "Work with you!",
    visible: true,
  },
  invest: {
    icon: "💰",
    description: "Learn about investing!",
    visible: true,
  },
  hopOnCall: {
    icon: "☎️",
    description: "Hopping on a call!",
  },
  shareWithFriends: {
    icon: "🙌",
    description: "Sharing with my friends!",
  },
};

export const visibleActions = Object.entries(actions).filter(
  ([_, a]) => a.visible,
);
