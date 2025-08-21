import z from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  user_type: z.string(),
});
export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
