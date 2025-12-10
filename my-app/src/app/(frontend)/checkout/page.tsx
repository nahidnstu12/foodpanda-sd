import { CheckoutPage } from '@/components/frontend/checkout/checkout-page';

// Mock cart data following your schema
const mockCartData = {
  items: [
    {
      id: 'cart-item-1',
      menu_item_id: 'item-uuid-1',
      menu_item: {
        name: 'Margherita Pizza',
        image_url:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
        restaurant: {
          id: 'rest-uuid-1',
          name: 'Pizza Palace - Dhanmondi',
        },
      },
      quantity: 2,
      base_price: 299,
      selected_choices: [
        {
          customization_id: 'custom-uuid-1',
          customization_name: 'Choose Size',
          choice_ids: ['choice-uuid-3'],
          choice_names: ['Large (14")'],
          price_changes: [100],
        },
        {
          customization_id: 'custom-uuid-2',
          customization_name: 'Select Crust',
          choice_ids: ['choice-uuid-7'],
          choice_names: ['Thick Crust'],
          price_changes: [50],
        },
        {
          customization_id: 'custom-uuid-3',
          customization_name: 'Add Toppings',
          choice_ids: ['choice-uuid-9', 'choice-uuid-14'],
          choice_names: ['Pepperoni', 'Extra Cheese'],
          price_changes: [50, 60],
        },
      ],
      calculated_price: 559, // 299 + 100 + 50 + 50 + 60 = 559
      special_instructions: 'Extra spicy please!',
    },
    {
      id: 'cart-item-2',
      menu_item_id: 'item-uuid-5',
      menu_item: {
        name: 'Spaghetti Carbonara',
        image_url:
          'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100&h=100&fit=crop',
        restaurant: {
          id: 'rest-uuid-1',
          name: 'Pizza Palace - Dhanmondi',
        },
      },
      quantity: 1,
      base_price: 349,
      selected_choices: [
        {
          customization_id: 'custom-uuid-10',
          customization_name: 'Choose Portion',
          choice_ids: ['choice-uuid-20'],
          choice_names: ['Regular Portion'],
          price_changes: [0],
        },
      ],
      calculated_price: 349,
      special_instructions: null,
    },
  ],
  restaurant: {
    id: 'rest-uuid-1',
    name: 'Pizza Palace - Dhanmondi',
    delivery_fee: 50,
  },
  subtotal: 1467, // (559 * 2) + 349
  delivery_fee: 50,
  total: 1517,
};

// Mock addresses
const mockAddresses = [
  {
    id: 'addr-uuid-1',
    label: 'Home',
    street: 'House 23, Road 5',
    area: 'Dhanmondi',
    city: 'Dhaka',
    postal_code: '1209',
    phone: '+880 1712-345678',
    is_default: true,
  },
  {
    id: 'addr-uuid-2',
    label: 'Office',
    street: 'Plot 15, Sector 7',
    area: 'Uttara',
    city: 'Dhaka',
    postal_code: '1230',
    phone: '+880 1712-345679',
    is_default: false,
  },
];

export default function Checkout() {
  return <CheckoutPage cartData={mockCartData} addresses={mockAddresses} />;
}
