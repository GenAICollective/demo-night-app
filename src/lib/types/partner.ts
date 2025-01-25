import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string(),
  url: z.string(),
  email: z.string().optional(),
  description: z.string(),
});

export const partnersSchema = z.array(partnerSchema);

export type Partner = z.infer<typeof partnerSchema>;
