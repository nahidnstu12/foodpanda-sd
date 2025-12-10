import { z } from "zod";
import { UserStatus } from "../../generated/prisma";

/**
 * Validation Schemas for User Module
 * All input validation happens here before reaching service layer
 */

// Base user schema
const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone format"
    )
    .min(6, "Phone must be at least 6 characters")
    .max(20, "Phone must not exceed 20 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
  status: z.enum(UserStatus),
});

// Create user schema
export const createUserSchema = baseUserSchema.extend({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .refine((email) => email.length <= 255, "Email too long"),
});

// Update user schema (all fields optional except id)
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone format"
    )
    .min(6, "Phone must be at least 6 characters")
    .max(20, "Phone must not exceed 20 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
  status: z.enum(UserStatus).optional(),
});

// ID validation schema
export const userIdSchema = z
  .string()
  .min(1, "User ID is required")
  .cuid("Invalid user ID format");

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  filters: z
    .record(z.string(), z.any())
    .optional()
    .nullable()
    .transform((val) => val || undefined),
});

// Permission IDs schema
export const permissionIdsSchema = z
  .array(z.string().cuid("Invalid permission ID"))
  .max(100, "Too many permissions");

// Role ID schema
export const roleIdSchema = z.string().cuid("Invalid role ID format");

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
