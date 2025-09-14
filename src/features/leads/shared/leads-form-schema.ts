import { z } from "zod";

export const leadsFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  source: z.string().min(1, "Source is required"),
  score: z.number().min(0, "Score must be at least 0").max(100, "Score must be at most 100"),
  status: z.string().min(1, "Status is required"),
});

export const leadsEditFormSchema = leadsFormSchema;
