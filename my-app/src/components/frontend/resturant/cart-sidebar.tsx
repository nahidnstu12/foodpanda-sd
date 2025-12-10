'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Mock cart data
const mockCart = {
  items: [
    {
      id: '1',
      name: 'Margherita Pizza',
      quantity: 2,
      price: 299,
      customizations: ['Medium Size', 'Thin Crust'],
    },
    {
      id: '2',
      name: 'Spaghetti Carbonara',
      quantity: 1,
      price: 349,
      customizations: ['Regular Portion'],
    },
  ],
  subtotal: 947,
  deliveryFee: 50,
  total: 997,
};

export function CartSidebar() {
  return (
    <div className="sticky top-40">
      <Card className="border-[#06C167]/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1C1C1C]">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockCart.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-[#9CA3AF] mb-3" />
              <p className="text-[#9CA3AF] text-sm">Your cart is empty</p>
              <p className="text-[#9CA3AF] text-xs mt-1">
                Add items to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {mockCart.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#1C1C1C] text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      {item.customizations.length > 0 && (
                        <p className="text-xs text-[#9CA3AF] line-clamp-1">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#9CA3AF]">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-[#1C1C1C]">
                          ৳ {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#9CA3AF] hover:text-[#FF6B6B]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Bill Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Subtotal</span>
                  <span className="text-[#1C1C1C] font-medium">
                    ৳ {mockCart.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Delivery Fee</span>
                  <span className="text-[#1C1C1C] font-medium">
                    ৳ {mockCart.deliveryFee}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-[#1C1C1C]">Total</span>
                  <span className="text-[#06C167]">৳ {mockCart.total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button className="w-full bg-[#06C167] hover:bg-[#05a855] text-white font-semibold py-6">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Additional Info */}
              <p className="text-xs text-[#9CA3AF] text-center">
                Free delivery on orders above ৳500
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}