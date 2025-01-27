import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().min(1, "URL is required"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Invalid email address",
    ),
  description: z.string().min(1, "Description is required"),
});

export type Partner = z.infer<typeof partnerSchema>;

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
