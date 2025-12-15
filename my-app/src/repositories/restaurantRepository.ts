import { db } from "@/lib/prisma";

type RestaurantQueryResult = Array<{
  id: string;
  name: string;
  cuisine: string;
  rating: number | null;
  cover_image_url: string | null;
  delivery_time_min?: number | null;
  delivery_time_max?: number | null;
  partner_profile?: {
    address?: Array<{
      city?: string | null;
      state?: string | null;
      country?: string | null;
    }>;
  };
}>;

export class RestaurantRepository {
  async findPopular(options: {
    limit: number;
    onlyActive: boolean;
  }): Promise<RestaurantQueryResult> {
    return (await db.restaurant.findMany({
      where: options.onlyActive ? { is_active: true } : undefined,
      orderBy: [{ rating: "desc" }, { updated_at: "desc" }],
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
              select: {
                city: true,
                state: true,
                country: true,
              },
            },
          },
        },
      },
    } as any)) as RestaurantQueryResult;
  }
}

export const restaurantRepository = new RestaurantRepository();

