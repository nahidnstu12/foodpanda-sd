// ============================================================================
// FILE: app/menu-item/[id]/page.tsx
// ============================================================================

import { MenuItemDetail } from '@/components/frontend/menu/menu-detail';

// Mock data following your Prisma schema structure
const mockMenuItem = {
  id: 'item-uuid-1',
  name: 'Margherita Pizza',
  description: 'Classic tomato sauce, fresh mozzarella, basil, extra virgin olive oil. Made with handmade dough and baked in a wood-fired oven.',
  price: 299, // Base price
  image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop',
  is_available: true,
  search_tags: ['vegetarian', 'classic', 'popular'],
  restaurant_id: 'rest-uuid-1',
  category_id: 'cat-uuid-1',
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-15'),
  
  // Nested relations from Prisma schema
  category: {
    id: 'cat-uuid-1',
    name: 'Classic Pizzas',
    menu: {
      id: 'menu-uuid-1',
      name: 'Main Menu',
      restaurant: {
        id: 'rest-uuid-1',
        name: 'Pizza Palace - Dhanmondi',
        logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
        rating: 4.5,
        delivery_time: '30-40 min',
        delivery_fee: 50,
      },
    },
  },
  
  // Customizations with Choices (from your seed pattern)
  customizations: [
    {
      id: 'custom-uuid-1',
      name: 'Choose Size',
      is_required: true,
      min_selection: 1,
      max_selection: 1,
      menu_item_id: 'item-uuid-1',
      choices: [
        {
          id: 'choice-uuid-1',
          name: 'Small (10")',
          price_change: -50,
          is_available: true,
          customization_id: 'custom-uuid-1',
        },
        {
          id: 'choice-uuid-2',
          name: 'Medium (12")',
          price_change: 0,
          is_available: true,
          customization_id: 'custom-uuid-1',
        },
        {
          id: 'choice-uuid-3',
          name: 'Large (14")',
          price_change: 100,
          is_available: true,
          customization_id: 'custom-uuid-1',
        },
        {
          id: 'choice-uuid-4',
          name: 'Extra Large (16")',
          price_change: 150,
          is_available: false, // Unavailable example
          customization_id: 'custom-uuid-1',
        },
      ],
    },
    {
      id: 'custom-uuid-2',
      name: 'Select Crust',
      is_required: true,
      min_selection: 1,
      max_selection: 1,
      menu_item_id: 'item-uuid-1',
      choices: [
        {
          id: 'choice-uuid-5',
          name: 'Thin Crust',
          price_change: 0,
          is_available: true,
          customization_id: 'custom-uuid-2',
        },
        {
          id: 'choice-uuid-6',
          name: 'Regular Crust',
          price_change: 0,
          is_available: true,
          customization_id: 'custom-uuid-2',
        },
        {
          id: 'choice-uuid-7',
          name: 'Thick Crust',
          price_change: 50,
          is_available: true,
          customization_id: 'custom-uuid-2',
        },
        {
          id: 'choice-uuid-8',
          name: 'Stuffed Crust',
          price_change: 80,
          is_available: true,
          customization_id: 'custom-uuid-2',
        },
      ],
    },
    {
      id: 'custom-uuid-3',
      name: 'Add Toppings',
      is_required: false,
      min_selection: 0,
      max_selection: 5,
      menu_item_id: 'item-uuid-1',
      choices: [
        {
          id: 'choice-uuid-9',
          name: 'Pepperoni',
          price_change: 50,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
        {
          id: 'choice-uuid-10',
          name: 'Italian Sausage',
          price_change: 50,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
        {
          id: 'choice-uuid-11',
          name: 'Mushrooms',
          price_change: 30,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
        {
          id: 'choice-uuid-12',
          name: 'Bell Peppers',
          price_change: 30,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
        {
          id: 'choice-uuid-13',
          name: 'Black Olives',
          price_change: 30,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
        {
          id: 'choice-uuid-14',
          name: 'Extra Cheese',
          price_change: 60,
          is_available: true,
          customization_id: 'custom-uuid-3',
        },
      ],
    },
    {
      id: 'custom-uuid-4',
      name: 'Extra Cheese',
      is_required: false,
      min_selection: 0,
      max_selection: 1,
      menu_item_id: 'item-uuid-1',
      choices: [
        {
          id: 'choice-uuid-15',
          name: 'No Extra Cheese',
          price_change: 0,
          is_available: true,
          customization_id: 'custom-uuid-4',
        },
        {
          id: 'choice-uuid-16',
          name: 'Extra Mozzarella',
          price_change: 60,
          is_available: true,
          customization_id: 'custom-uuid-4',
        },
      ],
    },
  ],
};

export default function MenuItemPage({ params }: { params: { id: string } }) {
  return <MenuItemDetail menuItem={mockMenuItem} />;
}

// ============================================================================
// FILE: components/menu-item/MenuItemDetail.tsx
// ============================================================================


// ============================================================================
// FILE: components/menu-item/CustomizationGroup.tsx
// ============================================================================


// ============================================================================
// FILE: components/menu-item/ChoiceItem.tsx
// ============================================================================


// ============================================================================
// FILE: app/checkout/page.tsx
// ============================================================================


// ============================================================================
// FILE: components/checkout/CheckoutPage.tsx
// ============================================================================
