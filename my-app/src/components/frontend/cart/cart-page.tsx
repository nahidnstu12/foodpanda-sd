'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CartPageProps {
  cartData: any;
}

export function CartPage({ cartData }: CartPageProps) {
  const [cartItems, setCartItems] = useState(cartData.items);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    setCartItems((prev: any) =>
      prev.map((item: any) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Simulate API call
    setTimeout(() => setIsUpdating(false), 500);
  };

  const removeItem = (itemId: string) => {
    setIsUpdating(true);
    setCartItems((prev: any) => prev.filter((item: any) => item.id !== itemId));

    // Simulate API call
    setTimeout(() => setIsUpdating(false), 500);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.calculated_price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = cartData.restaurant.delivery_fee;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-[#06C167]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#1C1C1C]">
              Shopping Cart
            </h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1C1C1C] mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to get started!
            </p>
            <Link href="/">
              <Button className="bg-[#06C167] hover:bg-[#05a855] text-white">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Restaurant Info */}
              <Card className="border-[#06C167]/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#06C167]/10 rounded-lg flex items-center justify-center">
                      <span className="text-[#06C167] font-bold text-lg">
                        🍕
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1C1C1C]">
                        {cartData.restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>25-35 min delivery</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[#06C167]/10 text-[#06C167]"
                    >
                      {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card className="border-[#06C167]/10">
                <CardHeader>
                  <CardTitle>Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {cartItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={item.menu_item.image_url}
                            alt={item.menu_item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1C1C1C] mb-2">
                            {item.menu_item.name}
                          </h4>

                          {/* Customizations */}
                          {item.selected_choices.map(
                            (choice: any, index: number) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600 mb-1"
                              >
                                <span className="font-medium">
                                  {choice.customization_name}:
                                </span>
                                <span className="ml-1">
                                  {choice.choice_names.join(', ')}
                                </span>
                                {choice.price_changes.some(
                                  (change: number) => change !== 0
                                ) && (
                                  <span className="ml-2 text-[#06C167] font-medium">
                                    (
                                    {choice.price_changes
                                      .map((change: number) =>
                                        change > 0
                                          ? `+৳${change}`
                                          : `৳${change}`
                                      )
                                      .join(', ')}
                                    )
                                  </span>
                                )}
                              </div>
                            )
                          )}

                          {/* Special Instructions */}
                          {item.special_instructions && (
                            <p className="text-sm text-gray-500 italic mt-2">
                              <span className="font-medium">Note:</span>{' '}
                              {item.special_instructions}
                            </p>
                          )}

                          {/* Price */}
                          <p className="text-sm font-semibold text-[#06C167] mt-2">
                            ৳{item.calculated_price} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={isUpdating}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-[#1C1C1C]">
                            ৳{item.calculated_price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Order Summary */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <Card className="border-[#06C167]/10">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Subtotal ({cartItems.length} item
                        {cartItems.length !== 1 ? 's' : ''})
                      </span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>৳{deliveryFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-[#1C1C1C]">
                      <span>Total</span>
                      <span>৳{total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button
                  className="w-full bg-[#06C167] hover:bg-[#05a855] text-white py-4 text-lg font-semibold"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout - ৳{total}
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center">
                Free delivery on orders over ৳500
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
