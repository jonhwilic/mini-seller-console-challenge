import { z } from "zod";

export const opportunitiesFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  stage: z.string().min(1, "Stage is required"),
  amount: z.number().min(0, "Amount must be at least 0").optional(),
  accountName: z.string().min(1, "Account name is required"),
});

export const opportunitiesEditFormSchema = opportunitiesFormSchema;
