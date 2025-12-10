# User Module Refactoring Guide

## 📁 New Structure

```
src/
├── validators/              # Validation Layer (NEW)
│   └── user.validator.ts   # Zod schemas for input validation
│
├── lib/                     # Utilities
│   └── sanitize.ts         # Sanitization utilities (NEW)
│
├── types/                   # Type Definitions
│   └── user.types.ts       # User DTOs and types
│
├── repositories/            # Data Access Layer
│   └── userRepository.ts   # All Prisma queries
│
├── services/                # Business Logic Layer
│   └── userService.ts      # Business rules & orchestration
│
└── actions/                 # API Layer
    ├── user.ts             # Original (to be replaced)
    └── user.refactored.ts  # Refactored version
```

---

## 🔄 Data Flow with Validation & Sanitization

```
Frontend Component
    ↓
Server Action (actions/)
    ↓ [1. Validate with Zod]
    ↓ [2. Sanitize input]
    ↓ [3. Authorize]
    ↓ [4. Call service]
Service Layer (services/)
    ↓ [Business logic]
Repository Layer (repositories/)
    ↓ [Database queries]
Database (Prisma)
```

---

## ✅ Key Improvements

### 1. **Validation Layer** (`validators/`)

- ✅ Zod schemas for all inputs
- ✅ Type-safe validation
- ✅ Clear error messages
- ✅ Reusable across actions

**Example**:

```typescript
// validators/user.validator.ts
export const createUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .optional()
    .nullable(),
  status: z.nativeEnum(UserStatus),
});
```

### 2. **Sanitization Layer** (`lib/sanitize.ts`)

- ✅ Removes HTML tags
- ✅ Prevents XSS attacks
- ✅ Normalizes input
- ✅ Phone number cleanup

**Example**:

```typescript
// lib/sanitize.ts
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/[<>\"']/g, ""); // Remove dangerous chars
}
```

### 3. **Repository Layer** (`repositories/`)

- ✅ All Prisma queries isolated
- ✅ Easy to test & mock
- ✅ Query optimization in one place

### 4. **Service Layer** (`services/`)

- ✅ Business logic centralized
- ✅ Duplicate checking
- ✅ Role-based filtering
- ✅ Transaction management

### 5. **Action Layer** (`actions/`)

- ✅ Thin wrapper
- ✅ Validation → Sanitization → Authorization → Service
- ✅ Consistent error handling

---

## 📝 Migration Example

### Before (Original)

```typescript
// actions/user.ts
export async function createUser(input: {
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
}) {
  const result = await withActionGuard(...);
  // Direct DB call in action
  const created = await db.user.create({ data: input });
  return { success: true, data: created };
}
```

### After (Refactored)

```typescript
// actions/user.refactored.ts
export async function createUser(input: unknown) {
  const result = await withActionGuard(
    "user.create",
    { required: PERMISSIONS.CREATE_USER },
    async () => {
      // 1. Validate
      const validated = createUserSchema.parse(input);

      // 2. Sanitize
      const sanitized = {
        name: sanitizeString(validated.name),
        email: sanitizeEmail(validated.email),
        phone: sanitizePhone(validated.phone),
        status: validated.status,
      };

      // 3. Call service
      return await userService.create(sanitized);
    }
  );
  return result;
}

// services/userService.ts
async create(input: CreateUserInput) {
  // Business logic: Check duplicates
  if (await userRepository.emailExists(input.email)) {
    return { success: false, message: "Email already exists" };
  }

  // Call repository
  const user = await userRepository.create(input);
  return { success: true, data: user };
}

// repositories/userRepository.ts
async create(data: CreateUserInput) {
  return await db.user.create({ data });
}
```

---

## 🛡️ Security Benefits

1. **Input Validation**: Zod ensures type safety & format validation
2. **Sanitization**: Prevents XSS, SQL injection (via Prisma), HTML injection
3. **Authorization**: Consistent permission checks via `withActionGuard`
4. **Error Handling**: Structured error responses, no sensitive data leaks

---

## 🧪 Testing Strategy

### Unit Tests

- **Validators**: Test schema validation
- **Sanitizers**: Test input cleaning
- **Services**: Test business logic (mock repositories)
- **Repositories**: Test queries (mock Prisma)

### Integration Tests

- **Actions**: Test full flow with real services

---

## 📊 Comparison

| Aspect             | Before            | After            |
| ------------------ | ----------------- | ---------------- |
| **Validation**     | Manual checks     | Zod schemas      |
| **Sanitization**   | None              | Dedicated layer  |
| **Business Logic** | Mixed in actions  | Service layer    |
| **DB Queries**     | Direct in actions | Repository layer |
| **Testability**    | Hard (coupled)    | Easy (layered)   |
| **Security**       | Basic             | Enhanced         |

---

## 🚀 Next Steps

1. **Review** `user.refactored.ts` - Compare with original
2. **Test** - Ensure all functions work correctly
3. **Replace** - Rename `user.refactored.ts` → `user.ts` (backup original)
4. **Update** - Update imports in components
5. **Extend** - Apply same pattern to other modules (roles, permissions, etc.)

---

## 📚 Files Created

- ✅ `validators/user.validator.ts` - Validation schemas
- ✅ `lib/sanitize.ts` - Sanitization utilities
- ✅ `types/user.types.ts` - Type definitions
- ✅ `repositories/userRepository.ts` - Data access
- ✅ `services/userService.ts` - Business logic
- ✅ `actions/user.refactored.ts` - Refactored actions

All files follow the layered architecture pattern with proper validation & sanitization! 🎉
