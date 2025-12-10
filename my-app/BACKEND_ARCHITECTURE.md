# Backend Architecture Guide

## 📁 Standard Backend Structure

```
src/
├── actions/              # Server Actions (API Layer)
│   ├── restaurant.ts     # Public-facing server actions
│   ├── user.ts
│   └── order.ts
│
├── services/            # Business Logic Layer
│   ├── restaurantService.ts
│   ├── userService.ts
│   └── orderService.ts
│
├── repositories/         # Data Access Layer (Optional but recommended)
│   ├── restaurantRepository.ts
│   ├── userRepository.ts
│   └── orderRepository.ts
│
├── lib/                  # Shared utilities & infrastructure
│   ├── prisma.ts
│   ├── auth.ts
│   └── withActionGuard.ts
│
└── types/                # Type definitions
    ├── restaurant.types.ts
    └── order.types.ts
```

---

## 🏗️ Layer Responsibilities

### 1. **Actions Layer** (`actions/`)

**Purpose**: Public API entry point, handles HTTP concerns, validation, authorization

**Responsibilities**:

- ✅ Input validation & sanitization
- ✅ Authentication/Authorization checks
- ✅ Request/Response transformation
- ✅ Error handling & formatting
- ✅ Calling services
- ❌ NO business logic
- ❌ NO direct database queries (use repositories/services)

**Example**:

```typescript
// actions/restaurant.ts
"use server";

import { restaurantService } from "@/services/restaurantService";
import { withActionGuard } from "@/lib/withActionGuard";
import { z } from "zod";

const createRestaurantSchema = z.object({
  name: z.string().min(1),
  cuisine: z.string(),
});

export async function createRestaurant(input: unknown) {
  return withActionGuard(
    "restaurant.create",
    { required: PERMISSIONS.CREATE_RESTAURANT },
    async () => {
      // 1. Validate input
      const validated = createRestaurantSchema.parse(input);

      // 2. Call service layer
      const restaurant = await restaurantService.create(validated);

      // 3. Return formatted response
      return { success: true, data: restaurant };
    }
  );
}
```

---

### 2. **Service Layer** (`services/`)

**Purpose**: Core business logic, orchestration, domain rules

**Responsibilities**:

- ✅ Business logic & validation
- ✅ Complex operations orchestration
- ✅ Domain rules enforcement
- ✅ Calling repositories
- ✅ Transaction management
- ❌ NO HTTP concerns
- ❌ NO direct Prisma calls (use repositories)

**Example**:

```typescript
// services/restaurantService.ts
import { restaurantRepository } from "@/repositories/restaurantRepository";
import { addressService } from "./addressService";

export class RestaurantService {
  async create(input: CreateRestaurantInput) {
    // Business logic: Validate business rules
    if (input.rating < 0 || input.rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    // Orchestration: Create restaurant + address in transaction
    return await restaurantRepository.transaction(async (tx) => {
      const restaurant = await restaurantRepository.create(tx, {
        name: input.name,
        cuisine: input.cuisine,
        rating: input.rating,
      });

      if (input.address) {
        await addressService.create(tx, {
          ...input.address,
          restaurantId: restaurant.id,
        });
      }

      return restaurant;
    });
  }

  async listPopular(options: ListOptions) {
    // Business logic: Determine "popular" criteria
    const minRating = 4.0;
    const minOrders = 10;

    return await restaurantRepository.findPopular({
      minRating,
      minOrders,
      limit: options.limit,
    });
  }
}

export const restaurantService = new RestaurantService();
```

---

### 3. **Repository Layer** (`repositories/`) - Optional but Recommended

**Purpose**: Data access abstraction, database queries

**Responsibilities**:

- ✅ Database queries (Prisma)
- ✅ Query optimization
- ✅ Data transformation
- ✅ Caching strategies
- ❌ NO business logic
- ❌ NO validation

**Example**:

```typescript
// repositories/restaurantRepository.ts
import db from "@/lib/prisma";

export class RestaurantRepository {
  async create(tx: any, data: CreateRestaurantData) {
    return await tx.restaurant.create({ data });
  }

  async findPopular(options: PopularOptions) {
    return await db.restaurant.findMany({
      where: {
        is_active: true,
        rating: { gte: options.minRating },
        _count: {
          orders: { gte: options.minOrders },
        },
      },
      orderBy: [{ rating: "desc" }, { updated_at: "desc" }],
      take: options.limit,
      include: {
        partner_profile: {
          include: {
            address: { where: { is_primary: true } },
          },
        },
      },
    });
  }

  async transaction<T>(callback: (tx: any) => Promise<T>) {
    return await db.$transaction(callback);
  }
}

export const restaurantRepository = new RestaurantRepository();
```

---

## 🔄 Data Flow

```
Frontend Component
    ↓
Server Action (actions/)
    ↓ [validates, authorizes]
Service Layer (services/)
    ↓ [business logic]
Repository Layer (repositories/)
    ↓ [queries]
Database (Prisma)
```

---

## 📝 Complete Example: Restaurant Feature

### 1. Types (`types/restaurant.types.ts`)

```typescript
export type CreateRestaurantInput = {
  name: string;
  cuisine: string;
  rating: number;
  address?: AddressInput;
};

export type PopularRestaurantDTO = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  deliveryTime: string;
};
```

### 2. Repository (`repositories/restaurantRepository.ts`)

```typescript
import db from "@/lib/prisma";

export class RestaurantRepository {
  async findPopular(options: { minRating: number; limit: number }) {
    return await db.restaurant.findMany({
      where: { is_active: true, rating: { gte: options.minRating } },
      orderBy: [{ rating: "desc" }],
      take: options.limit,
      select: {
        id: true,
        name: true,
        cuisine: true,
        rating: true,
        cover_image_url: true,
        delivery_time_min: true,
        delivery_time_max: true,
        partner_profile: {
          select: {
            address: {
              where: { is_primary: true },
              take: 1,
              select: { city: true, state: true },
            },
          },
        },
      },
    });
  }
}

export const restaurantRepository = new RestaurantRepository();
```

### 3. Service (`services/restaurantService.ts`)

```typescript
import { restaurantRepository } from "@/repositories/restaurantRepository";
import type { PopularRestaurantDTO } from "@/types/restaurant.types";

export class RestaurantService {
  async listPopular(options: {
    limit?: number;
  }): Promise<PopularRestaurantDTO[]> {
    const restaurants = await restaurantRepository.findPopular({
      minRating: 4.0, // Business rule: popular = rating >= 4.0
      limit: options.limit ?? 12,
    });

    // Transform to DTO
    return restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      rating: Number(r.rating ?? 0),
      cover_image_url: r.cover_image_url ?? FALLBACK_IMAGE,
      location: this.formatLocation(r.partner_profile?.address?.[0]),
      deliveryTime: this.formatDeliveryTime(
        r.delivery_time_min,
        r.delivery_time_max
      ),
      isFeatured: Number(r.rating ?? 0) >= 4.5,
    }));
  }

  private formatLocation(address?: {
    city?: string | null;
    state?: string | null;
  }) {
    if (!address) return "—";
    return [address.city, address.state].filter(Boolean).join(", ") || "—";
  }

  private formatDeliveryTime(min?: number | null, max?: number | null) {
    if (min && max) return `${min}-${max} min`;
    if (min) return `${min} min`;
    return "—";
  }
}

export const restaurantService = new RestaurantService();
```

### 4. Action (`actions/restaurant.ts`)

```typescript
"use server";

import { restaurantService } from "@/services/restaurantService";
import { withActionGuard } from "@/lib/withActionGuard";

export async function listPopularRestaurants(options: { limit?: number }) {
  // No auth required for public endpoint
  try {
    const restaurants = await restaurantService.listPopular(options);
    return restaurants;
  } catch (error) {
    console.error("Failed to list restaurants:", error);
    return [];
  }
}

export async function createRestaurant(input: CreateRestaurantInput) {
  return withActionGuard(
    "restaurant.create",
    { required: PERMISSIONS.CREATE_RESTAURANT },
    async () => {
      const restaurant = await restaurantService.create(input);
      return { success: true, data: restaurant };
    }
  );
}
```

---

## ✅ Best Practices

### 1. **Separation of Concerns**

- Actions = HTTP/API layer
- Services = Business logic
- Repositories = Data access

### 2. **Dependency Direction**

```
Actions → Services → Repositories → Database
```

Never reverse this flow!

### 3. **Error Handling**

```typescript
// Service layer throws domain errors
throw new BusinessError("Rating must be between 0-5");

// Action layer catches and formats
catch (error) {
  if (error instanceof BusinessError) {
    return { success: false, message: error.message };
  }
  return { success: false, message: "Internal error" };
}
```

### 4. **Testing Strategy**

- **Actions**: Test HTTP concerns, validation, auth
- **Services**: Test business logic, orchestration
- **Repositories**: Test queries, data transformation

### 5. **When to Skip Repository Layer**

- Simple CRUD operations
- Small projects
- Prototyping phase

Use repository layer when:

- Complex queries
- Need to swap databases
- Multiple data sources
- Heavy query optimization

---

## 🎯 Migration Strategy

### Current → Recommended

**Before** (actions doing everything):

```typescript
// actions/restaurant.ts
export async function listPopularRestaurants() {
  const restaurants = await db.restaurant.findMany({...}); // Direct DB
  return restaurants.map(...); // Business logic in action
}
```

**After** (layered):

```typescript
// actions/restaurant.ts
export async function listPopularRestaurants() {
  return await restaurantService.listPopular(); // Delegate to service
}

// services/restaurantService.ts
async listPopular() {
  const data = await restaurantRepository.findPopular(); // Delegate to repo
  return this.transformToDTO(data); // Business logic here
}

// repositories/restaurantRepository.ts
async findPopular() {
  return await db.restaurant.findMany({...}); // DB access here
}
```

---

## 📊 Summary

| Layer            | Purpose                       | Example                              |
| ---------------- | ----------------------------- | ------------------------------------ |
| **Actions**      | API entry, validation, auth   | `createRestaurant()`                 |
| **Services**     | Business logic, orchestration | `restaurantService.create()`         |
| **Repositories** | Data access, queries          | `restaurantRepository.findPopular()` |

**Rule of thumb**: If you're writing business logic in actions, move it to services. If you're writing Prisma queries in services, move them to repositories.
