import { restaurantRepository } from "@/repositories/restaurantRepository";
import type { PopularRestaurantDTO, ListPopularRestaurantsOptions } from "@/types/restaurant.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format";

export class RestaurantService {
  async listPopular(
    options: ListPopularRestaurantsOptions = {}
  ): Promise<PopularRestaurantDTO[]> {
    const { limit = 12, onlyActive = true } = options;

    // Fetch from repository
    const restaurants = await restaurantRepository.findPopular({
      limit,
      onlyActive,
    });

    // Transform to DTO (business logic)
    return restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: Number(restaurant.rating ?? 0),
      cover_image_url: restaurant.cover_image_url ?? FALLBACK_IMAGE,
      location: this.formatLocation(restaurant.partner_profile?.address?.[0]),
      deliveryTime: this.formatDeliveryTime(
        restaurant.delivery_time_min,
        restaurant.delivery_time_max
      ),
      isFeatured: Number(restaurant.rating ?? 0) >= 4.5, // Business rule: featured = rating >= 4.5
    }));
  }

  private formatLocation(address?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
  }): string {
    if (!address) return "—";

    const locationParts = [
      address.city,
      address.state,
      !address.state ? address.country : undefined,
    ].filter(Boolean);

    return locationParts.join(", ") || "—";
  }

  private formatDeliveryTime(
    min?: number | null,
    max?: number | null
  ): string {
    const minTime = typeof min === "number" ? min : undefined;
    const maxTime = typeof max === "number" ? max : undefined;

    if (minTime && maxTime) return `${minTime}-${maxTime} min`;
    if (minTime) return `${minTime} min`;
    return "—";
  }
}

export const restaurantService = new RestaurantService();

