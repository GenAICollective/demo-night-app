type QuickAction = {
  icon: string;
  description: string;
};

export const QUICK_ACTIONS: Record<string, QuickAction> = {
  testProduct: {
    icon: "🧑‍💻",
    description: "Testing the product!",
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
