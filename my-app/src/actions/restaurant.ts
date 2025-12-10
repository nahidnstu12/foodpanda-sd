"use server";

import { restaurantService } from "@/services/restaurantService";
import type {
  PopularRestaurantDTO,
  ListPopularRestaurantsOptions,
} from "@/types/restaurant.types";

/**
 * Action Layer - Public API entry point
 * Responsibilities:
 * - Input validation (if needed)
 * - Error handling & formatting
 * - Calling service layer
 */
export async function listPopularRestaurants(
  options: ListPopularRestaurantsOptions = {}
): Promise<PopularRestaurantDTO[]> {
  try {
    // Delegate to service layer
    return await restaurantService.listPopular(options);
  } catch (error) {
    console.error("Failed to list popular restaurants:", error);
    // Return empty array on error (or throw based on your error handling strategy)
    return [];
  }
}

/**
 * Example: Creating a restaurant with authorization
 */
// export async function createRestaurant(input: CreateRestaurantInput) {
//   return withActionGuard(
//     "restaurant.create",
//     { required: PERMISSIONS.CREATE_RESTAURANT },
//     async () => {
//       // Validate input
//       const validated = createRestaurantSchema.parse(input);
//
//       // Call service
//       const restaurant = await restaurantService.create(validated);
//
//       return { success: true, data: restaurant };
//     }
//   );
// }
