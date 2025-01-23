import { type DemoFeedback } from "~/server/api/routers/demo";

export type SortOption = "rank-highest" | "rank-lowest";
export type FilterOption = "invest" | "email" | "all";

export const sortFeedback = (feedback: DemoFeedback[], sortOption: SortOption) => {
  const sorted = [...feedback];
  
  switch (sortOption) {
    case "rank-highest":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "rank-lowest":
      return sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    default:
      return sorted;
  }
};

export const filterFeedback = (feedback: DemoFeedback[], filterOption: FilterOption) => {
  switch (filterOption) {
    case "invest":
      return feedback.filter((f) => 
        f.quickActions?.includes("invest") ?? false
      );
    case "email":
      return feedback.filter((f) => f.tellMeMore);
    case "all":
      return feedback;
    default:
      return feedback;
  }
}; 