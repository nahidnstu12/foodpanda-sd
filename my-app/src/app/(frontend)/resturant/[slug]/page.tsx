import { CartSidebar } from '@/components/frontend/resturant/cart-sidebar';
import { MenuNavigation } from '@/components/frontend/resturant/menu-navigation';
import { MenuSection } from '@/components/frontend/resturant/menu-section';
import { RestaurantHeader } from '@/components/frontend/resturant/resturant-header';

// Mock data - replace with actual API call
const mockRestaurant = {
  id: '1',
  name: 'Pizza Palace - Dhanmondi',
  description:
    'Authentic Italian pizzas with handmade dough and fresh ingredients',
  location: 'House 23, Road 5, Dhanmondi, Dhaka 1209',
  cover_image_url:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
  logo_url:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
  rating: 4.5,
  totalReviews: 250,
  deliveryTime: '30-40 min',
  deliveryFee: 50,
  cuisines: ['Italian', 'Fast Food', 'Pizza'],
  isOpen: true,
  menus: [
    {
      id: 'menu-1',
      name: 'Main Menu',
      categories: [
        {
          id: 'cat-1',
          name: 'Classic Pizzas',
          description: 'Traditional Italian pizzas with authentic flavors',
          items: [
            {
              id: 'item-1',
              name: 'Margherita Pizza',
              description:
                'Classic tomato sauce, fresh mozzarella, basil, extra virgin olive oil',
              price: 299,
              image_url:
                'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['vegetarian', 'popular'],
              rating: 4.6,
            },
            {
              id: 'item-2',
              name: 'Pepperoni Pizza',
              description: 'Tomato sauce, mozzarella, premium pepperoni slices',
              price: 399,
              image_url:
                'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['bestseller'],
              rating: 4.7,
            },
            {
              id: 'item-3',
              name: 'Quattro Formaggi',
              description:
                'Four cheese blend: mozzarella, gorgonzola, parmesan, ricotta',
              price: 449,
              image_url:
                'https://images.unsplash.com/photo-1571407970349-bc81e7e96c47?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['vegetarian'],
              rating: 4.5,
            },
            {
              id: 'item-4',
              name: 'BBQ Chicken Pizza',
              description:
                'BBQ sauce, grilled chicken, red onions, cilantro, mozzarella',
              price: 449,
              image_url:
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop',
              is_available: false,
              search_tags: ['spicy'],
              rating: 4.4,
            },
          ],
        },
        {
          id: 'cat-2',
          name: 'Gourmet Pastas',
          description: 'Fresh pasta made daily with traditional recipes',
          items: [
            {
              id: 'item-5',
              name: 'Spaghetti Carbonara',
              description:
                'Creamy egg sauce, crispy pancetta, parmesan, black pepper',
              price: 349,
              image_url:
                'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['popular'],
              rating: 4.8,
            },
            {
              id: 'item-6',
              name: 'Penne Arrabbiata',
              description:
                'Spicy tomato sauce with garlic and red chili peppers',
              price: 299,
              image_url:
                'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['vegetarian', 'spicy'],
              rating: 4.5,
            },
            {
              id: 'item-7',
              name: 'Fettuccine Alfredo',
              description: 'Rich cream sauce with parmesan and butter',
              price: 369,
              image_url:
                'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: ['vegetarian'],
              rating: 4.6,
            },
          ],
        },
        {
          id: 'cat-3',
          name: 'Beverages',
          description: 'Refresh yourself with our selection of drinks',
          items: [
            {
              id: 'item-8',
              name: 'Fresh Lime Soda',
              description: 'Freshly squeezed lime with soda and mint',
              price: 79,
              image_url:
                'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: [],
              rating: 4.3,
            },
            {
              id: 'item-9',
              name: 'Iced Coffee',
              description: 'Cold brew coffee with ice and cream',
              price: 129,
              image_url:
                'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=300&h=300&fit=crop',
              is_available: true,
              search_tags: [],
              rating: 4.4,
            },
          ],
        },
      ],
    },
  ],
};

export default function RestaurantPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Restaurant Header */}
      <RestaurantHeader restaurant={mockRestaurant} />

      {/* Menu Navigation - Sticky */}
      <MenuNavigation categories={mockRestaurant.menus[0].categories} />

      {/* Content Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Sections - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {mockRestaurant.menus[0].categories.map((category) => (
              <MenuSection key={category.id} category={category} />
            ))}
          </div>

          {/* Cart Sidebar - Right Side (Desktop) */}
          <div className="hidden lg:block">
            <CartSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-40">
        <button className="w-full bg-[#06C167] hover:bg-[#05a855] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2">
          <span>View Cart</span>
          <span className="bg-white text-[#06C167] px-2 py-1 rounded text-sm">
            3
          </span>
          <span>• ৳ 997</span>
        </button>
      </div>
    </div>
  );
}
