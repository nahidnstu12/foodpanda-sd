export type PopularRestaurantDTO = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  cover_image_url: string;
  location: string;
  deliveryTime: string;
  isFeatured: boolean;
};

export type ListPopularRestaurantsOptions = {
  limit?: number;
  onlyActive?: boolean;
};

