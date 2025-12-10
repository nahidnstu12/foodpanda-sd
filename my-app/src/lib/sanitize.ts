/**
 * Sanitization Utilities
 * Removes potentially dangerous content from user inputs
 */

/**
 * Sanitize string input - removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";

  return (
    input
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove script tags and content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove dangerous characters
      .replace(/[<>\"']/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
  );
}

/**
 * Sanitize email - basic cleanup
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>\"']/g, "");
}

/**
 * Sanitize phone number - keep only digits, +, -, spaces, parentheses
 */
export function sanitizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;

  return (
    phone
      .trim()
      .replace(/[^\d+\-() ]/g, "") // Keep only safe characters
      .replace(/\s+/g, " ") || // Normalize spaces
    null
  );
}

/**
 * Sanitize object - recursively sanitize string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value) as T[Extract<keyof T, string>];
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) =>
        typeof item === "string" ? sanitizeString(item) : item
      ) as T[Extract<keyof T, string>];
    }
  }

  return sanitized;
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(arr: string[]): string[] {
  return arr.map(sanitizeString).filter(Boolean);
}
